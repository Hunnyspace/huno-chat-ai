import React from 'react';

export const MailOpenIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M21.75 6.75V15a2.25 2.25 0 0 1-2.25 2.25H4.5A2.25 2.25 0 0 1 2.25 15V6.75" />
    <path
      fillRule="evenodd"
      d="M2.25 6.75c0-1.24 1.01-2.25 2.25-2.25h15a2.25 2.25 0 0 1 2.25 2.25v.109A.75.75 0 0 1 21.18 6.2l-8.54-4.27a.75.75 0 0 0-.68 0L3.42 6.2A.75.75 0 0 1 2.25 6.859V6.75Z"
      clipRule="evenodd"
    />
  </svg>
);