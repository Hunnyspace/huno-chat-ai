import React, { useState, useEffect } from 'react';
import AgencyDashboard from './components/AgencyDashboard';
import ChatAssistant from './components/ChatAssistant';
import Homepage from './components/Homepage';
import ClientLogin from './components/ClientLogin';
import ClientDashboard from './components/ClientDashboard';
import { Business, ChatSession } from './types';
import LiveChatModal from './components/LiveChatModal';
import AgencyLogin from './components/AgencyLogin';
import { onAgencyAuthChanged, signOutAgency } from './services/authService';
import type { User } from 'firebase/auth';
import { listenToBusinessById } from './services/firebaseService';


const App: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
  const businessId = params.get('businessId');
  const path = window.location.pathname;

  const [agencyUser, setAgencyUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  
  const [clientBusiness, setClientBusiness] = useState<Business | null>(() => {
    const storedBusiness = sessionStorage.getItem('clientBusiness');
    return storedBusiness ? JSON.parse(storedBusiness) : null;
  });

  const [liveChatSession, setLiveChatSession] = useState<ChatSession | null>(null);

  useEffect(() => {
    const unsubscribe = onAgencyAuthChanged((user) => {
      setAgencyUser(user);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  const handleClientLogout = () => {
    sessionStorage.removeItem('clientBusiness');
    setClientBusiness(null);
    window.history.pushState({}, '', '/client-login');
  };

  // Add a listener for real-time business data updates for logged-in clients
  useEffect(() => {
    if (!clientBusiness?.businessId) return;

    const unsubscribe = listenToBusinessById(clientBusiness.businessId, (updatedBusiness) => {
        if (updatedBusiness) {
            // Check if there are actual changes to avoid needless re-renders
            if (JSON.stringify(clientBusiness) !== JSON.stringify(updatedBusiness)) {
                sessionStorage.setItem('clientBusiness', JSON.stringify(updatedBusiness));
                setClientBusiness(updatedBusiness);
            }
        } else {
            // Business document was deleted or is inaccessible, so log out.
            handleClientLogout();
        }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientBusiness?.businessId]); // Re-run only when the business ID changes (i.e., new login)


  const handleLoginSuccess = (business: Business) => {
    sessionStorage.setItem('clientBusiness', JSON.stringify(business));
    setClientBusiness(business);
    window.history.pushState({}, '', '/client-dashboard');
  };

  const handleAgencyLogout = async () => {
    await signOutAgency();
    window.location.pathname = '/dashboard';
  };

  const handleJoinChat = (session: ChatSession) => {
    setLiveChatSession(session);
  };

  const handleCloseLiveChat = () => {
    setLiveChatSession(null);
  };

  const renderContent = () => {
    if (!authChecked) {
      return <div className="flex items-center justify-center h-screen bg-[var(--bg-primary)] text-white">Loading...</div>;
    }

    if (businessId) {
      return <ChatAssistant businessId={businessId} />;
    }

    if (path.startsWith('/dashboard')) {
      return agencyUser ? <AgencyDashboard onLogout={handleAgencyLogout} /> : <AgencyLogin />;
    }

    if (path.startsWith('/client-dashboard') && clientBusiness) {
        return <ClientDashboard business={clientBusiness} onLogout={handleClientLogout} onJoinChat={handleJoinChat} />;
    }

    if (path.startsWith('/client-login') || (path.startsWith('/client-dashboard') && !clientBusiness)) {
        return <ClientLogin onLoginSuccess={handleLoginSuccess} />;
    }

    return <Homepage />;
  };

  return (
    <div className="min-h-screen text-[var(--text-primary)] font-sans">
      {renderContent()}
      {clientBusiness && liveChatSession && (
        <LiveChatModal
          businessId={clientBusiness.businessId}
          session={liveChatSession}
          onClose={handleCloseLiveChat}
        />
      )}
    </div>
  );
};

export default App;