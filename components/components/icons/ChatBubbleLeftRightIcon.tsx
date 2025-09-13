import React from 'react';

export const ChatBubbleLeftRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-2.625 6c-.54 0-1.024.112-1.475.316l.308 1.734a.75.75 0 0 0 1.442-.258l.012-.062a2.25 2.25 0 0 1 4.28 1.481V12a2.25 2.25 0 0 1-2.25 2.25h-1.5a.75.75 0 0 0 0 1.5h1.5a3.75 3.75 0 0 0 3.75-3.75v-.75a3.75 3.75 0 0 0-3.75-3.75h-2.165Z"
      clipRule="evenodd"
    />
  </svg>
);