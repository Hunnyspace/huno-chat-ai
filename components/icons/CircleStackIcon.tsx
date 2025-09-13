import React from 'react';

export const CircleStackIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM6.262 6.072a8.25 8.25 0 1 0 11.476 11.856 8.25 8.25 0 0 0-11.476-11.856Z"
      clipRule="evenodd"
    />
    <path d="M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21ZM4.75 12a7.25 7.25 0 1 1 14.5 0 7.25 7.25 0 0 1-14.5 0Z" />
  </svg>
);