import React from 'react';

export const MicrophoneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12,15a4,4,0,0,0,4-4V6a4,4,0,0,0-8,0v5A4,4,0,0,0,12,15Zm6-4a6,6,0,0,1-12,0V6a6,6,0,0,1,12,0Z" />
    <path d="M12,19a3,3,0,0,1-3,3,1,1,0,0,1,0-2,1,1,0,0,0,2,0,1,1,0,0,1,2,0,1,1,0,0,0,2,0,1,1,0,0,1,0,2,3,3,0,0,1-3-3Z" />
  </svg>
);