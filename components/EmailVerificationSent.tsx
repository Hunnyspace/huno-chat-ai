import React from 'react';
import { MailOpenIcon } from './icons/MailOpenIcon';

interface EmailVerificationSentProps {
  email: string;
}

const EmailVerificationSent: React.FC<EmailVerificationSentProps> = ({ email }) => {
  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="w-full max-w-md p-8 space-y-6 text-center glass-pane rounded-2xl">
        <MailOpenIcon className="w-16 h-16 mx-auto text-[var(--accent-primary)]" />
        <h1 className="text-2xl font-bold text-white mt-4">Check Your Inbox</h1>
        <p className="text-[var(--text-secondary)]">
          We've sent a secure login link to <strong className="text-[var(--text-primary)]">{email}</strong>.
        </p>
        <p className="text-[var(--text-secondary)]">
          Please click the link in that email to complete your sign-in. You can close this tab.
        </p>
      </div>
    </div>
  );
};

export default EmailVerificationSent;