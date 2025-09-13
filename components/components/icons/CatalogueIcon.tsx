import React from 'react';

export const CatalogueIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M19,2H5A3,3,0,0,0,2,5V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V5A3,3,0,0,0,19,2ZM5,4H19a1,1,0,0,1,1,1V7H4V5A1,1,0,0,1,5,4ZM19,20H5a1,1,0,0,1-1-1V9H20V19A1,1,0,0,1,19,20Z" />
    <rect x="6" y="12" width="4" height="2" rx="0.5" />
    <rect x="6" y="15" width="4" height="2" rx="0.5" />
  </svg>
);