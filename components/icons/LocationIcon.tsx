import React from 'react';

export const LocationIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    aria-hidden="true"
  >
    <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a2.25 2.25 0 0 0 .286-.176L21 12.852V9.75a8.966 8.966 0 0 0-8.288-8.983.023.023 0 0 0-.154 0A8.966 8.966 0 0 0 3 9.75v3.102l9.25 5.328c.123.07.25.128.38.176zM12 9.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5z" clipRule="evenodd" />
  </svg>
);