import React from 'react';
import { ChatMessage } from '../types';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { WebsiteIcon } from './icons/WebsiteIcon';
import { InstagramIcon } from './icons/InstagramIcon';

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  const bubbleClasses = isUser
    ? 'rounded-2xl rounded-br-lg'
    : 'rounded-2xl rounded-bl-lg';

  const bubbleStyle = isUser
    ? { background: 'var(--accent-gradient)', color: 'var(--bg-primary)' }
    : { background: 'var(--bg-secondary)', color: 'var(--text-primary)' };
    
  const containerClasses = isUser ? 'flex justify-end' : 'flex justify-start';

  const renderTextWithButtons = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const phoneRegex = /(\+?\d{1,3}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/g;
    
    const parts = text.split(new RegExp(`(${urlRegex.source}|${phoneRegex.source})`, 'g'));

    return parts.map((part, index) => {
      if (part && part.match(urlRegex)) {
        if (part.includes('wa.me')) {
          return (
            <a
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center mt-3 bg-green-600 text-white text-xs font-bold py-1.5 px-3 rounded-full hover:bg-green-500 transition-all duration-200 animate-slide-up"
            >
              <WhatsAppIcon className="w-4 h-4 mr-1.5"/>
              Contact on WhatsApp
            </a>
          );
        }
        if (part.includes('instagram.com')) {
          return (
            <a
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center mt-3 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white text-xs font-bold py-1.5 px-3 rounded-full hover:opacity-90 transition-all duration-200 animate-slide-up"
            >
              <InstagramIcon className="w-4 h-4 mr-1.5" />
              View on Instagram
            </a>
          );
        }
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center mt-3 bg-sky-600 text-white text-xs font-bold py-1.5 px-3 rounded-full hover:bg-sky-500 transition-all duration-200 animate-slide-up"
          >
            <WebsiteIcon className="w-4 h-4 mr-1.5"/>
            Visit Website
          </a>
        );
      }
      if (part && part.match(phoneRegex)) {
        return (
          <a
            key={index}
            href={`tel:${part.replace(/\s/g, '')}`}
            className="inline-flex items-center mt-3 bg-blue-600 text-white text-xs font-bold py-1.5 px-3 rounded-full hover:bg-blue-500 transition-all duration-200 animate-slide-up"
          >
            <PhoneIcon className="w-4 h-4 mr-1.5"/>
            Call Now
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };


  return (
    <div className={`${containerClasses} animate-fade-in`}>
      <div className={`p-1 max-w-xs sm:max-w-sm md:max-w-md ${bubbleClasses} transition-all duration-300`} style={bubbleStyle}>
        {message.imageUrl && (
            <img src={message.imageUrl} alt="User upload" className="rounded-xl object-cover w-full mb-1" />
        )}
        {message.text && (
            <div className={`whitespace-pre-wrap flex flex-col items-start text-sm px-3 py-2 ${isUser ? 'font-medium' : ''}`}>
                {isUser ? message.text : renderTextWithButtons(message.text)}
            </div>
        )}
      </div>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        
        @keyframes slide-up {
           from { opacity: 0; transform: translateY(5px); }
           to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.5s ease-out 0.2s backwards; }
       `}</style>
    </div>
  );
};

export default ChatMessageBubble;
