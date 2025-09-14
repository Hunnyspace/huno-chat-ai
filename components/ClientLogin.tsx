import React, { useState } from 'react';
import { Business } from '../types';
import { verifyClientLogin } from '../services/firebaseService';
import { sendSignInLink } from '../services/authService';
import { LockClosedIcon } from './icons/LockClosedIcon';
import Navbar from './Navbar';
import EmailVerificationSent from './EmailVerificationSent';

interface ClientLoginProps {
  onLoginSuccess: (business: Business) => void;
}

const ClientLogin: React.FC<ClientLoginProps> = ({ onLoginSuccess }) => {
  const [businessId, setBusinessId] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [waitingForEmailLink, setWaitingForEmailLink] = useState(false);
  const [businessEmail, setBusinessEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const business = await verifyClientLogin(businessId.trim(), pin.trim());
      if (business) {
        if (!business.businessEmail) {
            setError("This business does not have an email configured for secure login. Please contact support.");
            setLoading(false);
            return;
        }
        // Store business temporarily to retrieve after email link confirmation
        sessionStorage.setItem('pendingClientLogin', JSON.stringify(business));
        await sendSignInLink(business.businessEmail, `${window.location.origin}/finishLogin`);
        setBusinessEmail(business.businessEmail);
        setWaitingForEmailLink(true);

      } else {
        setError('Invalid Business ID or PIN. Please try again.');
      }
    } catch (err) {
      console.error("Login error:", err);
      setError('An error occurred during login. Please ensure a Firebase user exists for the business email.');
    } finally {
      setLoading(false);
    }
  };
  
  if (waitingForEmailLink) {
    return (
        <div style={{ backgroundColor: 'var(--bg-primary)' }}>
            <Navbar />
            <EmailVerificationSent email={businessEmail} />
        </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-md p-8 space-y-6 glass-pane rounded-2xl">
          <div className="text-center">
            {/* Fix: Replaced style prop with a Tailwind text color class since the component does not accept a style prop. */}
            <LockClosedIcon className="w-12 h-12 mx-auto text-[var(--accent-primary)]"/>
            <h1 className="text-2xl font-bold text-white mt-4">Client Dashboard Login</h1>
            <p className="text-[var(--text-secondary)]">Access your chat analytics and insights.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={businessId}
              onChange={(e) => setBusinessId(e.target.value)}
              placeholder="Enter your Business ID"
              className="w-full input-field rounded-lg px-4 py-3"
              required
              aria-label="Business ID input"
            />
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter your PIN"
              className="w-full input-field rounded-lg px-4 py-3"
              required
              aria-label="PIN input"
            />
            {error && <p className="text-sm text-red-400 text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 px-4 rounded-lg disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientLogin;