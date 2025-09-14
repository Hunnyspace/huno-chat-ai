/// <reference types="vite/client" />

import React, { useState } from 'react';
import { LockClosedIcon } from './icons/LockClosedIcon';

interface PinLockScreenProps {
  onUnlock: () => void;
}

const PinLockScreen: React.FC<PinLockScreenProps> = ({ onUnlock }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  // Fix: Reverted to import.meta.env for client-side Vite environment variables.
  const correctPin = import.meta.env.VITE_DASHBOARD_PIN;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctPin) {
        setError("PIN not configured. Please set VITE_DASHBOARD_PIN in the environment variables.");
        return;
    }
    if (pin === correctPin) {
      onUnlock();
    } else {
      setError('Incorrect PIN. Please try again.');
      setPin('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="w-full max-w-sm p-8 space-y-6 glass-pane rounded-2xl">
        <div className="text-center">
            {/* Fix: Replaced style prop with a Tailwind text color class since the component does not accept a style prop. */}
            <LockClosedIcon className="w-12 h-12 mx-auto text-[var(--accent-primary)]" />
          <h1 className="text-2xl font-bold text-white mt-4">Dashboard Locked</h1>
          <p className="text-[var(--text-secondary)]">Please enter your PIN to continue.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter PIN"
            className="w-full text-center input-field rounded-lg px-4 py-3 tracking-widest"
            required
            aria-label="PIN input"
          />
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full btn-primary py-3 px-4 rounded-lg"
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
};

export default PinLockScreen;