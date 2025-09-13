import React from 'react';

export const WebsiteIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M20.6,3.41a2,2,0,0,0-2.83,0l-2.05,2A8,8,0,0,0,3.31,17.83l-1,1a2,2,0,0,0,0,2.82,2,2,0,0,0,2.82,0l1-1A8,8,0,0,0,18.57,8.22l2-2A2,2,0,0,0,20.6,3.41ZM5.46,16.54a6,6,0,0,1,8.08-8.08L15.6,10.5A4,4,0,0,0,10,16a3.9,3.9,0,0,0,.5.5Z" />
    <path d="M9.46,6.54a4,4,0,0,0,5.66,0l2.05-2.05a6,6,0,0,1-8.08,8.08L7.05,10.5A4,4,0,0,0,9.46,6.54Z" />
  </svg>
);