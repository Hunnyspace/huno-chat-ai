import React from 'react';

interface AnnouncementBannerProps {
  text: string;
}

const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({ text }) => {
  return (
    <div className="bg-gray-900/80 backdrop-blur-sm text-xs font-semibold py-1.5 overflow-hidden whitespace-nowrap relative border-b border-[var(--border-color)]">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee-text {
          display: inline-block;
          padding-left: 100%;
          animation: marquee 20s linear infinite;
        }
      `}</style>
      <div className="animate-marquee-text">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400">{text}</span>
      </div>
    </div>
  );
};

export default AnnouncementBanner;