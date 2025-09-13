import React, { useState } from 'react';
import { signInAgency } from '../services/authService';
import { LockClosedIcon } from './icons/LockClosedIcon';

const AgencyLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInAgency(email, password);
      // On successful login, the onAuthStateChanged listener in App.tsx will handle the redirect.
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="w-full max-w-sm p-8 space-y-6 glass-pane rounded-2xl">
        <div className="text-center">
          <LockClosedIcon className="w-12 h-12 mx-auto text-[var(--accent-primary)]" />
          <h1 className="text-2xl font-bold text-white mt-4">Agency Login</h1>
          <p className="text-[var(--text-secondary)]">Enter your credentials to access the dashboard.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="w-full input-field rounded-lg px-4 py-3"
            required
            aria-label="Email input"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full input-field rounded-lg px-4 py-3"
            required
            aria-label="Password input"
          />
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 px-4 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AgencyLogin;
