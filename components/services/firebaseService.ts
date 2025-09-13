import { Business, ChatMessage, ChatMessageLog, ChatSession, Ticket, UsageMetrics } from '../types';
import { db } from './firebaseConfig';
import firebase from "firebase/compat/app";

const businessesCollectionRef = db.collection('businesses');
const ticketsCollectionRef = db.collection('supportTickets');

// New function to log usage metrics atomically.
export const logUsage = async (businessId: string, metrics: Partial<Omit<UsageMetrics, 'totalSessions'>>) => {
    if (!businessId) {
        console.warn("logUsage called without businessId");
        return;
    }
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const usageRef = db.collection('businesses').doc(businessId).collection('usageMetrics').doc(today);

    const dataToUpdate: { [key: string]: firebase.firestore.FieldValue } = {};
    if (metrics.geminiTokens) {
        dataToUpdate.geminiTokens = firebase.firestore.FieldValue.increment(metrics.geminiTokens);
    }
    if (metrics.firestoreReads) {
        dataToUpdate.firestoreReads = firebase.firestore.FieldValue.increment(metrics.firestoreReads);
    }
    if (metrics.firestoreWrites) {
        dataToUpdate.firestoreWrites = firebase.firestore.FieldValue.increment(metrics.firestoreWrites);
    }

    if (Object.keys(dataToUpdate).length > 0) {
        try {
            await usageRef.set(dataToUpdate, { merge: true });
        } catch (error) {
            console.error("Failed to log usage:", error);
        }
    }
};

// New function to fetch and aggregate usage metrics for the last 30 days.
export const getUsageForBusiness = async (businessId: string): Promise<UsageMetrics> => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    const startDate = thirtyDaysAgo.toISOString().split('T')[0];

    const usageQuery = db.collection('businesses').doc(businessId).collection('usageMetrics')
        .where(firebase.firestore.FieldPath.documentId(), '>=', startDate);
    
    const snapshot = await usageQuery.get();

    const aggregatedMetrics: UsageMetrics = {
        geminiTokens: 0,
        firestoreReads: 0,
        firestoreWrites: 0,
    };

    snapshot.docs.forEach(doc => {
        const data = doc.data();
        aggregatedMetrics.geminiTokens += data.geminiTokens || 0;
        aggregatedMetrics.firestoreReads += data.firestoreReads || 0;
        aggregatedMetrics.firestoreWrites += data.firestoreWrites || 0;
    });

    return aggregatedMetrics;
};

export const getBusinesses = async (): Promise<Business[]> => {
  const querySnapshot = await businessesCollectionRef.get();
  return querySnapshot.docs.map(doc => doc.data() as Business);
};

export const getBusinessById = async (id: string): Promise<Business | null> => {
  const docRef = businessesCollectionRef.doc(id);
  const docSnap = await docRef.get();
  await logUsage(id, { firestoreReads: 1 });
  if (docSnap.exists) {
    return docSnap.data() as Business;
  }
  return null;
};

export const addBusiness = async (businessData: Omit<Business, 'businessId' | 'products'>): Promise<Business> => {
  const businessId = `${businessData.businessName.toLowerCase().replace(/\s+/g, '-')}-${businessData.city.toLowerCase().replace(/\s+/g, '-')}`;
  
  const newBusiness: Business = {
    ...businessData,
    businessId,
    products: [],
  };
  
  const docRef = businessesCollectionRef.doc(businessId);
  await docRef.set(newBusiness);
  await logUsage(businessId, { firestoreWrites: 1 });
  return newBusiness;
};

export const updateBusiness = async (businessId: string, businessData: Business): Promise<void> => {
  const docRef = businessesCollectionRef.doc(businessId);
  await docRef.set(businessData, { merge: true });
  await logUsage(businessId, { firestoreWrites: 1 });
};

export const verifyClientLogin = async (businessId: string, pin: string): Promise<Business | null> => {
    const business = await getBusinessById(businessId); // This logs 1 read
    if (business && business.dashboardPin === pin) {
        return business;
    }
    return null;
};

export const logChatMessage = async (businessId: string, sessionId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const sessionRef = businessesCollectionRef.doc(businessId).collection('chatSessions').doc(sessionId);
    const messageLog: Omit<ChatMessageLog, 'id'> & { timestamp: any } = {
        ...message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };

    try {
        const sessionDoc = await sessionRef.get();
        let writes = 0;
        if (!sessionDoc.exists) {
            await sessionRef.set({
                id: sessionId,
                startTime: firebase.firestore.FieldValue.serverTimestamp(),
                lastMessageTime: firebase.firestore.FieldValue.serverTimestamp(),
                agentJoined: false,
            });
            writes++;
        }
        
        await sessionRef.collection('messages').add(messageLog);
        writes++;
        
        await sessionRef.update({ 
            lastMessageTime: firebase.firestore.FieldValue.serverTimestamp() 
        });
        writes++;

        await logUsage(businessId, { firestoreReads: 1, firestoreWrites: writes });
    } catch (error) {
        console.error("Error logging chat message:", error);
    }
};

export const listenToLiveChat = (businessId: string, sessionId: string, callback: (messages: ChatMessage[], agentJoined: boolean) => void): (() => void) => {
    logUsage(businessId, { firestoreReads: 2 }); // For setting up the two listeners
    const messagesRef = businessesCollectionRef.doc(businessId).collection('chatSessions').doc(sessionId).collection('messages').orderBy('timestamp', 'asc');
    const sessionRef = businessesCollectionRef.doc(businessId).collection('chatSessions').doc(sessionId);
    
    let cachedMessages: ChatMessage[] = [];
    let cachedAgentJoined: boolean = false;

    const fireCallback = () => {
      if (typeof structuredClone === 'function') {
        callback(structuredClone(cachedMessages), cachedAgentJoined);
      } else {
        callback(JSON.parse(JSON.stringify(cachedMessages)), cachedAgentJoined);
      }
    };

    const unsubscribeMessages = messagesRef.onSnapshot(snapshot => {
        cachedMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage));
        fireCallback();
    });

    const unsubscribeSession = sessionRef.onSnapshot(snapshot => {
        cachedAgentJoined = snapshot.data()?.agentJoined || false;
        fireCallback();
    });

    return () => {
        unsubscribeMessages();
        unsubscribeSession();
    };
};

export const listenToLiveSessions = (businessId: string, callback: (sessions: ChatSession[]) => void): (() => void) => {
    const fortyFiveDaysAgo = new Date();
    fortyFiveDaysAgo.setDate(fortyFiveDaysAgo.getDate() - 45);

    const sessionsRef = businessesCollectionRef.doc(businessId).collection('chatSessions')
        .where('lastMessageTime', '>=', fortyFiveDaysAgo)
        .orderBy('lastMessageTime', 'desc')
        .limit(20);

    return sessionsRef.onSnapshot(async (querySnapshot) => {
        let reads = 1 + querySnapshot.docs.length; // 1 for query, N for message sub-queries
        const sessions: ChatSession[] = [];
        for (const doc of querySnapshot.docs) {
            const sessionData = doc.data();
            const messagesRef = doc.ref.collection('messages').orderBy('timestamp', 'desc').limit(1);
            const messagesSnapshot = await messagesRef.get();
            reads += messagesSnapshot.docs.length;
            const messages = messagesSnapshot.docs.map(msgDoc => ({ id: msgDoc.id, ...msgDoc.data() } as ChatMessageLog));

            sessions.push({
                id: doc.id,
                startTime: sessionData.startTime,
                lastMessageTime: sessionData.lastMessageTime,
                agentJoined: sessionData.agentJoined || false,
                messages: messages
            });
        }
        await logUsage(businessId, { firestoreReads: reads });
        callback(sessions);
    });
};

export const getChatSessionsForBusiness = async (businessId: string, shouldLog = true): Promise<ChatSession[]> => {
    const fortyFiveDaysAgo = new Date();
    fortyFiveDaysAgo.setDate(fortyFiveDaysAgo.getDate() - 45);

    const sessionsRef = businessesCollectionRef.doc(businessId).collection('chatSessions')
        .where('lastMessageTime', '>=', fortyFiveDaysAgo)
        .orderBy('lastMessageTime', 'desc').limit(50);
    const sessionsSnapshot = await sessionsRef.get();
    
    let reads = 1;
    let messageReads = 0;

    const sessions: ChatSession[] = [];
    for (const doc of sessionsSnapshot.docs) {
        reads++; // For the messages query
        const sessionData = doc.data();
        const messagesRef = doc.ref.collection('messages').orderBy('timestamp', 'asc');
        const messagesSnapshot = await messagesRef.get();
        const messages = messagesSnapshot.docs.map(msgDoc => ({ id: msgDoc.id, ...msgDoc.data() } as ChatMessageLog));
        messageReads += messages.length;
        
        sessions.push({
            id: doc.id,
            startTime: sessionData.startTime,
            lastMessageTime: sessionData.lastMessageTime,
            agentJoined: sessionData.agentJoined || false,
            messages: messages
        });
    }

    if (shouldLog) {
      await logUsage(businessId, { firestoreReads: reads + messageReads });
    }
    return sessions;
};

export const joinChatSession = async (businessId: string, sessionId: string, agentName: string, agentGender: string) => {
    const sessionRef = businessesCollectionRef.doc(businessId).collection('chatSessions').doc(sessionId);
    await sessionRef.update({ agentJoined: true });
    await logUsage(businessId, { firestoreWrites: 1 });
    
    const prefix = agentGender.toLowerCase() === 'female' ? 'Ms.' : 'Mr.';
    const joinMessage = `${prefix} ${agentName} has joined the chat to assist you.`;
    
    // This will log its own usage
    await logChatMessage(businessId, sessionId, {
        text: joinMessage,
        sender: 'agent'
    });
};

export const sendAgentMessage = async (businessId: string, sessionId: string, text: string) => {
    await logChatMessage(businessId, sessionId, { text, sender: 'agent' });
};

export const submitTicket = async (ticketData: Omit<Ticket, 'id' | 'status' | 'createdAt'>): Promise<void> => {
    const newTicket: Omit<Ticket, 'id'> = {
        ...ticketData,
        status: 'open',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };
    await ticketsCollectionRef.add(newTicket);
};

export const getSupportTickets = async (): Promise<Ticket[]> => {
    const querySnapshot = await ticketsCollectionRef.orderBy('createdAt', 'desc').get();
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ticket));
};

export const updateTicketStatus = async (ticketId: string, status: 'open' | 'closed'): Promise<void> => {
    const docRef = ticketsCollectionRef.doc(ticketId);
    await docRef.update({ status });
};

export const getDashboardMetrics = async (): Promise<{ totalBusinesses: number; totalMessages: number; activeSubscriptions: number; }> => {
    const businesses = await getBusinesses();
    let totalMessages = 0;
    
    const today = new Date();
    const activeSubscriptions = businesses.filter(b => new Date(b.subscriptionExpiry) > today).length;

    for (const business of businesses) {
        const sessionsSnapshot = await businessesCollectionRef.doc(business.businessId).collection('chatSessions').get();
        for (const sessionDoc of sessionsSnapshot.docs) {
             const messagesCountSnapshot = await sessionDoc.ref.collection('messages').get();
             totalMessages += messagesCountSnapshot.size;
        }
    }

    return {
        totalBusinesses: businesses.length,
        totalMessages,
        activeSubscriptions
    };
};