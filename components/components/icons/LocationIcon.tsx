import React from 'react';

export const LocationIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    aria-hidden="true"
  >
    <path d="M12,2A10,10,0,0,0,2,12a9.89,9.89,0,0,0,2.2,6.32l6.29,4.39a2,2,0,0,0,2.57-.44.75.75,0,0,1,1.17-.18l.44.44a2,2,0,0,0,2.83,0l1.18-1.18A10,10,0,0,0,12,2Zm0,13a3,3,0,1,1,3-3A3,3,0,0,1,12,15Z" />
  </svg>
);