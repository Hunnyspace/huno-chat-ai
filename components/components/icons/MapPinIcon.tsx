import React from 'react';

export const MapPinIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a2.25 2.25 0 0 0 .286-.176L21 12.852V9.75a8.966 8.966 0 0 0-8.288-8.983.023.023 0 0 0-.154 0A8.966 8.966 0 0 0 3 9.75v3.102l9.25 5.328c.123.07.25.128.38.176Z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M12 1.5c-4.97 0-9 4.03-9 9V12a.75.75 0 0 0 .382.664l9 5.25a.75.75 0 0 0 .736 0l9-5.25A.75.75 0 0 0 21 12v-1.5c0-4.97-4.03-9-9-9Zm0 3.9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" clipRule="evenodd" />
    </svg>
);