export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  type: 'product' | 'service';
  offer?: {
    newPrice: number;
    expiry: string;
  };
}

export interface Business {
  businessId: string;
  businessName: string;
  businessEmail: string; // The official email for sending login links and notifications.
  city: string;
  businessCategory: string;
  businessInfo: string;
  characterName: string;
  businessWaNumber: string;
  shareImageUrl: string;
  products: Product[];
  profileImageUrl: string;
  websiteUrl?: string;
  googleBusinessUrl?: string;
  catalogueTitle: string;
  catalogueSubtitle: string;
  currency: 'USD' | 'INR' | 'EUR' | 'GBP';
  subscriptionExpiry: string;
  dashboardPin: string;
  announcementText?: string;
  geminiApiKey?: string; // Client-specific Gemini API key
  totalMessages: number; // For efficient metric calculation
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai' | 'agent' | 'system'; // Added 'system' for special notifications
  imageUrl?: string;
  timestamp?: any;
}

export interface ChatMessageLog {
    id: string;
    text: string;
    sender: 'user' | 'ai' | 'agent' | 'system';
    imageUrl?: string;
    timestamp: any;
}

export interface ChatSession {
    id: string;
    startTime: any;
    lastMessageTime: any;
    messages: ChatMessageLog[];
    agentJoined?: boolean; // Flag for human agent takeover
}

// Type for support tickets
export interface Ticket {
    id: string;
    businessId: string;
    businessName: string;
    issue: string;
    details: string;
    logs: string; // To store diagnostic info
    status: 'open' | 'closed';
    createdAt: any;
}

export interface UsageMetrics {
  geminiTokens: number;
  firestoreReads: number;
  firestoreWrites: number;
}