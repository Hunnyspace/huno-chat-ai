import React from 'react';

export const KeyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.79-.263 1.123L.99 20.485a.75.75 0 0 0 1.06 1.06l2.252-2.252a.75.75 0 0 0-.017-1.046L2.45 16.416a.75.75 0 0 0-1.06-1.06l2.252-2.252a.75.75 0 0 0 1.045.018l1.838 1.837a.75.75 0 0 0 1.06 0l2.252-2.252a.75.75 0 0 0-.017-1.046l-1.837-1.838a.75.75 0 0 0-1.06-1.06l2.252-2.252a.75.75 0 0 0 1.045.018L12 7.21l.47-.47a6.75 6.75 0 0 0 3.28-5.24Z"
      clipRule="evenodd"
    />
  </svg>
);