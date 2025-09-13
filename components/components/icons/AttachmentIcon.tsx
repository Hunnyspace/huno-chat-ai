import React from 'react';

export const AttachmentIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    aria-hidden="true"
  >
    <path d="M14.25,6.08L19,10.83V19.5A1.5,1.5,0,0,1,17.5,21H6.5A1.5,1.5,0,0,1,5,19.5V4.5A1.5,1.5,0,0,1,6.5,3H13.5V5.25A0.75,0.75,0,0,0,14.25,6.08M18.25,10H14V5.75L18.25,10Z" />
  </svg>
);