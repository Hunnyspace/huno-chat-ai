import React, { useState } from 'react';

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 transition-transform duration-300 ${className}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
);

const PrivacyDisclaimer: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="text-xs rounded-lg overflow-hidden transition-all" style={{backgroundColor: 'rgba(22, 30, 49, 0.5)', border: '1px solid var(--border-color)'}}>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full flex justify-between items-center p-2 hover:bg-[var(--bg-secondary)]/80 transition-colors"
                aria-expanded={isOpen}
                aria-controls="disclaimer-content"
            >
                <span className="font-medium text-[var(--text-secondary)]">Important: AI Chat Disclaimer & Privacy</span>
                <ChevronDownIcon className={isOpen ? 'rotate-180' : ''} />
            </button>
            <div 
                id="disclaimer-content"
                className={`transition-all duration-300 ease-in-out grid ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
                <div className="overflow-hidden">
                    <div className="p-3 pt-0 text-[var(--text-secondary)]/90 space-y-2" style={{borderTop: '1px solid var(--border-color)'}}>
                        <p><strong>Privacy Notice:</strong> This chat is powered by an AI assistant. To improve our service, conversations may be reviewed. Please do not share any sensitive personal or financial information in this chat.</p>
                        <p><strong>Disclaimer:</strong> The information provided by the AI is based on the data given to it about the business and is for general guidance only. It may not be completely accurate or current. For official details, pricing, or appointments, please contact the business directly. Responses from this AI do not constitute a legal contract or a binding offer.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyDisclaimer;
