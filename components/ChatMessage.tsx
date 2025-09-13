import React from 'react';
import { ChatMessage } from '../types';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { WebsiteIcon } from './icons/WebsiteIcon';
import { InstagramIcon } from './icons/InstagramIcon';

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

const urlRegex = /(https?:\/\/[^\s]+)/g;
const phoneRegex = /(\+?\d{1,3}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/g;

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  if (message.sender === 'system') {
    return (
      <div className="text-center my-2 animate-fade-in">
        <p className="text-xs text-[var(--text-secondary)] font-semibold inline-block px-3 py-1 bg-[var(--bg-secondary)] rounded-full">
          {message.text}
        </p>
      </div>
    );
  }

  const bubbleClasses = isUser
    ? 'rounded-2xl rounded-br-lg'
    : 'rounded-2xl rounded-bl-lg';

  const bubbleStyle = isUser
    ? { background: 'var(--accent-gradient)', color: 'var(--bg-primary)' }
    : { background: 'var(--bg-secondary)', color: 'var(--text-primary)' };
    
  const containerClasses = isUser ? 'flex justify-end' : 'flex justify-start';
  
  const uniqueUrls = [...new Set(message.text.match(urlRegex) || [])];
  const uniquePhones = [...new Set(message.text.match(phoneRegex) || [])];
  const hasButtons = uniqueUrls.length > 0 || uniquePhones.length > 0;

  const cleanTextForDisplay = (text: string) => {
    return text
      .replace(urlRegex, '')
      .replace(phoneRegex, '')
      .replace(/\*\*/g, '')
      .split('\n')
      .filter(line => line.trim() !== '')
      .join('\n');
  };

  const mainText = cleanTextForDisplay(message.text);
  
  const renderUrlButton = (url: string, index: number) => {
    if (url.includes('wa.me')) {
      return (
        <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-green-600 text-white text-xs font-bold py-1.5 px-3 rounded-full hover:bg-green-500 transition-all duration-200 animate-slide-up">
          <WhatsAppIcon className="w-4 h-4 mr-1.5"/> Contact on WhatsApp
        </a>
      );
    }
    if (url.includes('instagram.com')) {
      return (
        <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white text-xs font-bold py-1.5 px-3 rounded-full hover:opacity-90 transition-all duration-200 animate-slide-up">
          <InstagramIcon className="w-4 h-4 mr-1.5" /> View on Instagram
        </a>
      );
    }
    return (
      <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-sky-600 text-white text-xs font-bold py-1.5 px-3 rounded-full hover:bg-sky-500 transition-all duration-200 animate-slide-up">
        <WebsiteIcon className="w-4 h-4 mr-1.5"/> Visit Website
      </a>
    );
  };
  
  const renderPhoneButton = (phone: string, index: number) => (
     <a key={index} href={`tel:${phone.replace(/\s/g, '')}`} className="inline-flex items-center bg-blue-600 text-white text-xs font-bold py-1.5 px-3 rounded-full hover:bg-blue-500 transition-all duration-200 animate-slide-up">
      <PhoneIcon className="w-4 h-4 mr-1.5"/> Call Now
    </a>
  );


  return (
    <div className={`${containerClasses} animate-fade-in`}>
      <div className={`p-1 max-w-xs sm:max-w-sm md:max-w-md ${bubbleClasses} transition-all duration-300`} style={bubbleStyle}>
        {message.imageUrl && (
            <img src={message.imageUrl} alt="User upload" className="rounded-xl object-cover w-full mb-1" />
        )}
        {mainText && (
            <div className={`whitespace-pre-wrap text-sm px-3 py-2 ${isUser ? 'font-medium' : ''}`}>
                {mainText}
            </div>
        )}
        {hasButtons && (
          <div className={`flex flex-wrap gap-2 pt-2 px-3 pb-2 ${mainText ? 'border-t border-white/10' : ''}`}>
            {uniquePhones.map(renderPhoneButton)}
            {uniqueUrls.map(renderUrlButton)}
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