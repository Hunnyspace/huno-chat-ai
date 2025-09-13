import React from 'react';

export const SpeakerXMarkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12,6a1,1,0,0,0-1,1V17a1,1,0,0,0,2,0V7A1,1,0,0,0,12,6Z" />
    <path d="M7,10a1,1,0,0,0-1,1v2a1,1,0,0,0,2,0V11A1,1,0,0,0,7,10Z" />
    <path d="M17,10a1,1,0,0,0-1,1v2a1,1,0,0,0,2,0V11A1,1,0,0,0,17,10Z" />
    <path d="M21,12a1,1,0,0,1-1,1H2a1,1,0,0,1,0-2H20A1,1,0,0,1,21,12Z" fillOpacity="0.3" />
    <path d="M4.22,4.22a1,1,0,0,0,0,1.41L18.36,19.78a1,1,0,0,0,1.41-1.41L5.64,4.22A1,1,0,0,0,4.22,4.22Z" />
  </svg>
);