import React from 'react';

interface AnnouncementBannerProps {
  text: string;
}

const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({ text }) => {
  return (
    <div className="bg-gray-900/80 backdrop-blur-sm text-xs font-semibold py-1.5 overflow-hidden whitespace-nowrap relative border-b border-[var(--border-color)]">
      <style>{`
        @keyframes scroll-and-pause {
          0% { transform: translateX(100%); }
          85% { transform: translateX(-100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-scroll-text {
          /* 15s scroll, 3s pause */
          animation: scroll-and-pause 18s linear infinite;
          display: inline-block;
        }
      `}</style>
      <div className="animate-scroll-text">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 px-8">{text}</span>
      </div>
    </div>
  );
};

export default AnnouncementBanner;