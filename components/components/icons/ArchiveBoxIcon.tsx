import React from 'react';

export const ArchiveBoxIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M2.25 2.25a.75.75 0 0 1 .75-.75h18a.75.75 0 0 1 .75.75v5.25a.75.75 0 0 1-.75.75H3a.75.75 0 0 1-.75-.75V2.25ZM3 9.75A.75.75 0 0 0 2.25 9v5.25a.75.75 0 0 0 .75.75h18a.75.75 0 0 0 .75-.75V9a.75.75 0 0 0-.75-.75H3ZM10.5 12.75a.75.75 0 0 0-1.5 0v2.25a.75.75 0 0 0 1.5 0v-2.25Z"
      clipRule="evenodd"
    />
    <path d="M2.25 18a.75.75 0 0 0 .75.75h18a.75.75 0 0 0 .75-.75V18a.75.75 0 0 0-.75-.75H3a.75.75 0 0 0-.75.75v0Z" />
  </svg>
);
