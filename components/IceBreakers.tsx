import React from 'react';

interface IceBreakersProps {
  onPromptClick: (prompt: string) => void;
}

const prompts = [
  "What are your services?",
  "What are your business hours?",
  "Where are you located?",
  "How can I book an appointment?",
];

const IceBreakers: React.FC<IceBreakersProps> = ({ onPromptClick }) => {
  return (
    <div className="animate-fade-in-late space-y-2 py-4">
        <p className="text-center text-xs text-[var(--text-secondary)] font-medium mb-3">Or try one of these prompts</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {prompts.map((prompt) => (
                <button
                    key={prompt}
                    onClick={() => onPromptClick(prompt)}
                    className="text-left text-sm w-full p-3 rounded-lg hover:bg-[var(--bg-secondary)]/80 transition-all duration-200"
                    style={{backgroundColor: 'rgba(22, 30, 49, 0.8)', border: '1px solid var(--border-color)'}}
                >
                    {prompt}
                </button>
            ))}
        </div>
       <style>{`
        @keyframes fade-in-late {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-late { animation: fade-in-late 0.5s ease-out 0.5s backwards; }
       `}</style>
    </div>
  );
};

export default IceBreakers;
