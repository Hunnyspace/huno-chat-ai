import React from 'react';

export const AIAvatarIcon: React.FC = () => (
  <div className="w-12 h-12 rounded-full p-1 shadow-lg" style={{ background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-primary))'}}>
    <div className="w-full h-full rounded-full flex items-center justify-center" style={{ background: 'var(--accent-gradient)'}}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" style={{color: 'var(--bg-primary)'}}>
             <path fillRule="evenodd" d="M4.5 3.75a3 3 0 0 0-3 3v.75h21v-.75a3 3 0 0 0-3-3h-15Zm0 9a3 3 0 0 0-3 3v.75h21v-.75a3 3 0 0 0-3-3h-15ZM4.5 15.75a3 3 0 0 1 3-3h15v3.75a3 3 0 0 1-3 3h-15v-3.75Z" clipRule="evenodd" />
        </svg>
    </div>
  </div>
);
