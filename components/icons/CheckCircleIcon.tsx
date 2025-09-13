import React from 'react';

export const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.06-1.06l-3.103 3.104-1.59-1.59a.75.75 0 0 0-1.06 1.061l2.122 2.122a.75.75 0 0 0 1.06 0l3.64-3.64Z"
      clipRule="evenodd"
    />
  </svg>
);
