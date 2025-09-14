import React, { useState, useEffect, useCallback } from 'react';
import { Business, ChatSession } from '../types';
import { getChatSessionsForBusiness, joinChatSession, listenToLiveSessions } from '../services/firebaseService';
import { generateChatSummary } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';
import SubscriptionProgress from './SubscriptionProgress';
import SupportTicketModal from './SupportTicketModal';
import BarChart from './charts/BarChart';
import LineChart from './charts/LineChart';
import { LifebuoyIcon } from './icons/LifebuoyIcon';
import { ChatBubbleLeftRightIcon } from './icons/ChatBubbleLeftRightIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { XMarkIcon } from './icons/XMarkIcon';

interface ClientDashboardProps {
  business: Business;
  onLogout: () => void;
  onJoinChat: (session: ChatSession) => void;
}

const AgentJoinModal: React.FC<{ onJoin: (name: string, gender: string) => void; onClose: () => void; }> = ({ onJoin, onClose }) => {
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && gender) {
            onJoin(name, gender);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={onClose}>
            <div className="glass-pane rounded-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
                 <header className="p-4 flex justify-between items-center" style={{borderBottom: '1px solid var(--border-color)'}}>
                    <h2 className="text-lg font-bold" style={{color: 'var(--accent-secondary)'}}>Join Live Chat</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors" aria-label="Close modal">
                        <XMarkIcon className="w-6 h-6 text-[var(--text-secondary)]" />
                    </button>
                </header>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <p className="text-sm text-[var(--text-secondary)]">Please enter your details to join the chat and assist the customer.</p>
                     <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full input-field rounded-lg px-4 py-3"
                        required
                    />
                    <select
                        value={gender}
                        onChange={e => setGender(e.target.value)}
                        required
                        className="w-full input-field rounded-lg px-4 py-3"
                    >
                        <option value="" disabled>Select your gender...</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Prefer not to say</option>
                    </select>
                    <button type="submit" className="w-full btn-primary py-3 px-4 rounded-lg">
                        Join Chat Session
                    </button>
                </form>
            </div>
        </div>
    );
};


const ClientDashboard: React.FC<ClientDashboardProps> = ({ business, onLogout, onJoinChat }) => {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [liveSessions, setLiveSessions] = useState<ChatSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState('');
    const [generatingSummary, setGeneratingSummary] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
    const [totalSessions, setTotalSessions] = useState(0);
    const [sessionToJoin, setSessionToJoin] = useState<ChatSession | null>(null);

    const chatLink = `${window.location.origin}/?businessId=${business.businessId}`;
    
    useEffect(() => {
        const unsubscribe = listenToLiveSessions(business.businessId, (sessions) => {
            setLiveSessions(sessions);
            setLoading(false);
        });
        
        getChatSessionsForBusiness(business.businessId, true).then(allSessions => {
            setTotalSessions(allSessions.length);
        });

        return () => unsubscribe();
    }, [business.businessId]);

    const handleGenerateSummary = async () => {
        setGeneratingSummary(true);
        const allSessions = await getChatSessionsForBusiness(business.businessId, true);
        setSessions(allSessions);
        setTotalSessions(allSessions.length);
        const result = await generateChatSummary(allSessions, business);
        setSummary(result);
        setGeneratingSummary(false);
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(chatLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleConfirmJoin = async (agentName: string, agentGender: string) => {
        if (!sessionToJoin) return;
        
        const allSessions = await getChatSessionsForBusiness(business.businessId, false); // No need to log reads here
        const fullSession = allSessions.find(s => s.id === sessionToJoin.id);

        if (fullSession) {
            if (!fullSession.agentJoined) {
                await joinChatSession(business.businessId, sessionToJoin.id, agentName, agentGender);
            }
            onJoinChat(fullSession);
        }
        setSessionToJoin(null);
    };


    return (
        <>
        <div className="min-h-screen p-4 sm:p-8" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold" style={{color: 'var(--accent-secondary)'}}>{business.businessName}</h1>
                        <p className="text-[var(--text-secondary)]">Client Dashboard</p>
                    </div>
                     <div className="flex items-center space-x-3">
                        <button onClick={() => setIsSupportModalOpen(true)} className="flex items-center font-semibold py-2 px-4 rounded-lg btn-secondary">
                            <LifebuoyIcon className="w-5 h-5 mr-2" /> Request Support
                        </button>
                        <button onClick={onLogout} className="font-semibold py-2 px-4 rounded-lg btn-secondary hover:bg-red-600/20 hover:border-red-500/50">
                            Logout
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="glass-pane p-6 rounded-2xl md:col-span-2">
                        <h2 className="font-bold text-lg text-[var(--accent-secondary)] mb-3">Your Public Chat Link</h2>
                        <div className="flex flex-col sm:flex-row items-stretch gap-2">
                           <input type="text" readOnly value={chatLink} className="flex-grow input-field rounded-lg px-3 py-2" />
                           <button onClick={handleCopyLink} className="btn-primary font-bold py-2 px-4 rounded-lg">
                               {copied ? 'Copied!' : 'Copy'}
                           </button>
                        </div>
                    </div>
                    <div className="glass-pane p-6 rounded-2xl flex flex-col justify-center">
                         <h2 className="font-bold text-lg text-[var(--accent-secondary)]">Total Chat Sessions</h2>
                         <p className="text-4xl font-extrabold text-white">{totalSessions}</p>
                    </div>
                </div>

                 <div className="glass-pane p-6 rounded-2xl mb-8">
                    <h2 className="font-bold text-lg text-[var(--accent-secondary)] mb-3">Subscription Status</h2>
                    <SubscriptionProgress expiryDate={business.subscriptionExpiry} />
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="glass-pane p-6 rounded-2xl">
                            <h2 className="font-bold text-xl text-[var(--accent-secondary)] mb-4 flex items-center"><ChatBubbleLeftRightIcon className="w-6 h-6 mr-3" />Live Sessions</h2>
                            {loading ? <p>Loading sessions...</p> : (
                                <ul className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                                    {liveSessions.length === 0 ? <p className="text-[var(--text-secondary)] text-sm">No active chat sessions right now.</p> :
                                    liveSessions.map(session => {
                                        const previewText = session.messages[0]?.text || 'Session started...';
                                        const truncatedText = previewText.length > 50 ? `${previewText.substring(0, 50)}...` : previewText;
                                        return (
                                            <li key={session.id} className="flex items-center justify-between w-full text-left p-3 rounded-lg hover:bg-[var(--bg-secondary)]/80 transition-colors" style={{backgroundColor: 'var(--bg-secondary)'}}>
                                                <div>
                                                    <p className="font-semibold text-sm">Session from {new Date(session.lastMessageTime?.toDate()).toLocaleString()}</p>
                                                    <p className="text-xs text-[var(--text-secondary)]">{truncatedText}</p>
                                                </div>
                                                <button onClick={() => setSessionToJoin(session)} className={`font-bold py-1.5 px-4 rounded-md text-xs transition-colors whitespace-nowrap ${session.agentJoined ? 'bg-green-600/80 text-white' : 'btn-primary'}`}>
                                                    {session.agentJoined ? 'Joined' : 'Join'}
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                        <div className="glass-pane p-6 rounded-2xl">
                            <h2 className="font-bold text-xl text-[var(--accent-secondary)] mb-4 flex items-center"><ChartBarIcon className="w-6 h-6 mr-3" />Analytics Overview</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-64">
                               <LineChart />
                               <BarChart />
                            </div>
                        </div>
                    </div>
                    {/* Right Column */}
                    <div className="glass-pane p-6 rounded-2xl flex flex-col">
                        <h2 className="font-bold text-xl text-[var(--accent-secondary)] mb-4">AI-Powered Weekly Summary</h2>
                        <button onClick={handleGenerateSummary} disabled={generatingSummary} className="w-full btn-primary py-3 px-4 rounded-lg disabled:opacity-50 mb-4">
                            {generatingSummary ? 'Analyzing Chats...' : 'Generate Summary'}
                        </button>
                        <div className="p-4 rounded-lg flex-grow overflow-y-auto" style={{backgroundColor: 'var(--bg-secondary)'}}>
                           {summary ? <MarkdownRenderer content={summary} /> : <div className="text-sm text-[var(--text-secondary)]">Click the button to generate an analysis of your recent chat sessions.</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {isSupportModalOpen && <SupportTicketModal business={business} onClose={() => setIsSupportModalOpen(false)} />}
        {sessionToJoin && <AgentJoinModal onJoin={handleConfirmJoin} onClose={() => setSessionToJoin(null)} />}
        </>
    );
};

export default ClientDashboard;
