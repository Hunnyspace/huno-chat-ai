import React, { useEffect, useState } from 'react';
import { auth } from '../services/firebaseConfig';
import { Business } from '../types';

interface FinishLoginProps {
    onClientLoginSuccess: (business: Business) => void;
}

const FinishLogin: React.FC<FinishLoginProps> = ({ onClientLoginSuccess }) => {
    const [status, setStatus] = useState('Verifying your login link...');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const finishSignIn = async () => {
            if (auth.isSignInWithEmailLink(window.location.href)) {
                let email = window.localStorage.getItem('emailForSignIn');
                if (!email) {
                    // User opened the link on a different device. Prompt for email.
                    email = window.prompt('Please provide your email for confirmation');
                }
                if (!email) {
                    setError("Email is required to complete sign-in.");
                    return;
                }

                try {
                    await auth.signInWithEmailLink(email, window.location.href);
                    window.localStorage.removeItem('emailForSignIn');
                    
                    // Check if it's a client login
                    const pendingClientData = sessionStorage.getItem('pendingClientLogin');
                    if (pendingClientData) {
                        const business: Business = JSON.parse(pendingClientData);
                        sessionStorage.removeItem('pendingClientLogin');
                        onClientLoginSuccess(business);
                         // The parent component will handle the redirect via state change
                    } else {
                        // It's an agency login, redirect to the dashboard
                        setStatus('Login successful! Redirecting...');
                        window.location.href = '/dashboard';
                    }
                } catch (err: any) {
                    console.error("Error signing in with email link:", err);
                    setError(err.message || 'Invalid or expired login link. Please try logging in again.');
                }
            } else {
                setError("This is not a valid login link.");
            }
        };

        finishSignIn();
    }, [onClientLoginSuccess]);

    return (
        <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="w-full max-w-sm p-8 text-center glass-pane rounded-2xl">
                <h1 className="text-2xl font-bold text-white mb-4">Finishing Sign-In</h1>
                {error ? (
                    <p className="text-red-400">{error}</p>
                ) : (
                    <p className="text-[var(--text-secondary)]">{status}</p>
                )}
            </div>
        </div>
    );
};

export default FinishLogin;
