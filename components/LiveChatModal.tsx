import React, { useState, useEffect, useRef } from 'react';
import { ChatSession, ChatMessage } from '../types';
import { sendAgentMessage } from '../services/firebaseService';
import { db } from '../services/firebaseConfig';
import { getAgentSuggestions } from '../services/geminiService';
import { XMarkIcon } from './icons/XMarkIcon';
import { SendIcon } from './icons/SendIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface LiveChatModalProps {
  businessId: string;
  session: ChatSession;
  onClose: () => void;
}

const LiveChatModal: React.FC<LiveChatModalProps> = ({ businessId, session, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(session.messages);
  const [agentInput, setAgentInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const messagesRef = db.collection('businesses').doc(businessId)
      .collection('chatSessions').doc(session.id)
      .collection('messages').orderBy('timestamp', 'asc');
      
    const unsubscribe = messagesRef.onSnapshot(async (snapshot) => {
      const liveMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage));
      
      const lastMessage = liveMessages[liveMessages.length - 1];
      if (messages.length > 0 && liveMessages.length > messages.length && lastMessage.sender === 'user') {
          setLoadingSuggestions(true);
          const newSuggestions = await getAgentSuggestions(liveMessages, businessId);
          setSuggestions(newSuggestions);
          setLoadingSuggestions(false);
      }
      setMessages(liveMessages);
    });

    return () => unsubscribe();
  }, [businessId, session.id, messages]);

  useEffect(() => {
    chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
  }, [messages, suggestions]);

  const handleSend = async (messageText?: string) => {
    const text = messageText || agentInput;
    if (text.trim()) {
      await sendAgentMessage(businessId, session.id, text.trim());
      setAgentInput('');
      setSuggestions([]);
    }
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleSend();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-pane rounded-2xl w-full max-w-lg max-h-[70vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="p-4 flex justify-between items-center" style={{borderBottom: '1px solid var(--border-color)'}}>
          <h2 className="text-lg font-bold" style={{color: 'var(--accent-secondary)'}}>Live Chat with User</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors" aria-label="Close modal">
            <XMarkIcon className="w-6 h-6 text-[var(--text-secondary)]" />
          </button>
        </header>

        <main ref={chatContainerRef} className="p-4 flex-1 overflow-y-auto space-y-3">
            {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-lg max-w-sm ${msg.sender === 'user' ? 'bg-indigo-600' : msg.sender === 'agent' ? 'bg-green-600' : 'bg-[var(--bg-secondary)]'}`}>
                        <p className="text-xs text-[var(--text-secondary)] mb-1 capitalize">{msg.sender === 'agent' ? 'You (Agent)' : msg.sender}</p>
                        <p className="text-sm whitespace-pre-wrap text-white">{msg.text}</p>
                    </div>
                </div>
            ))}
        </main>
        
        <footer className="p-4" style={{borderTop: '1px solid var(--border-color)'}}>
          {loadingSuggestions && (
            <div className="text-center text-xs text-[var(--text-secondary)] mb-2 animate-pulse">
              Generating AI suggestions...
            </div>
          )}
          {suggestions.length > 0 && (
            <div className="mb-3 space-y-2">
                <p className="text-xs font-semibold text-[var(--text-secondary)] flex items-center"><SparklesIcon className="w-4 h-4 mr-2 text-[var(--accent-primary)]"/> AI Suggestions:</p>
                <div className="flex flex-wrap gap-2">
                    {suggestions.map((s, i) => (
                        <button key={i} onClick={() => handleSend(s)} className="text-xs btn-secondary py-1.5 px-3 rounded-full">
                            {s}
                        </button>
                    ))}
                </div>
            </div>
          )}
          <form onSubmit={handleFormSubmit} className="flex items-center space-x-2">
            <input
              type="text"
              value={agentInput}
              onChange={(e) => setAgentInput(e.target.value)}
              placeholder="Type your message as an agent..."
              className="flex-1 input-field rounded-full px-5 py-3"
            />
            <button type="submit" className="p-3 rounded-full bg-gradient-to-br from-green-600 to-teal-600 text-white transition-all" aria-label="Send message">
              <SendIcon />
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default LiveChatModal;