import React from 'react';

export const CodeBracketIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10.5 4.72a.75.75 0 0 1 0 1.06L6.28 10.061l4.22 4.28a.75.75 0 1 1-1.06 1.06l-4.75-4.81a.75.75 0 0 1 0-1.06l4.75-4.81a.75.75 0 0 1 1.06 0Zm3 1.06a.75.75 0 0 1 1.06 0l4.75 4.81a.75.75 0 0 1 0 1.06l-4.75 4.81a.75.75 0 1 1-1.06-1.06L17.72 10.061l-4.22-4.28Z"
      clipRule="evenodd"
    />
  </svg>
);
