import React from 'react';

export const ChartBarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M3 13.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75v-6Z" />
    <path d="M9.75 8.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v11.25a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75V8.25Z" />
    <path d="M16.5 3.75a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v15.75a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75V3.75Z" />
  </svg>
);