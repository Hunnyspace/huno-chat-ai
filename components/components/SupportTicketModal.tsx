import React, { useState } from 'react';
import { Business } from '../types';
import { submitTicket } from '../services/firebaseService';
import { XMarkIcon } from './icons/XMarkIcon';
import { LifebuoyIcon } from './icons/LifebuoyIcon';

interface SupportTicketModalProps {
  business: Business;
  onClose: () => void;
}

const SupportTicketModal: React.FC<SupportTicketModalProps> = ({ business, onClose }) => {
    const [issue, setIssue] = useState('');
    const [details, setDetails] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const logs = `
            Business ID: ${business.businessId}
            Business Name: ${business.businessName}
            User Agent: ${navigator.userAgent}
            Timestamp: ${new Date().toISOString()}
        `;
        try {
            await submitTicket({
                businessId: business.businessId,
                businessName: business.businessName,
                issue,
                details,
                logs,
            });
            setSubmitted(true);
        } catch (error) {
            console.error("Failed to submit ticket:", error);
            alert("There was an error submitting your ticket. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={onClose}>
            <div className="glass-pane rounded-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <header className="p-4 flex justify-between items-center" style={{borderBottom: '1px solid var(--border-color)'}}>
                    <h2 className="text-lg font-bold flex items-center" style={{color: 'var(--accent-secondary)'}}>
                        <LifebuoyIcon className="w-6 h-6 mr-3" /> Submit a Support Ticket
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors" aria-label="Close modal">
                        <XMarkIcon className="w-6 h-6 text-[var(--text-secondary)]" />
                    </button>
                </header>
                
                {submitted ? (
                    <div className="p-8 text-center">
                        <h3 className="text-xl font-bold text-green-400">Ticket Submitted!</h3>
                        <p className="text-[var(--text-secondary)] mt-2">Our team has received your request and will get back to you shortly. Thank you!</p>
                        <button onClick={onClose} className="mt-6 btn-primary py-2 px-6 rounded-lg">
                            Close
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <main className="p-6 space-y-4">
                            <select
                                value={issue}
                                onChange={(e) => setIssue(e.target.value)}
                                required
                                className="w-full input-field rounded-lg px-4 py-3"
                            >
                                <option value="" disabled>Select an issue category...</option>
                                <option value="billing">Billing or Subscription</option>
                                <option value="ai-response">AI Response Incorrect</option>
                                <option value="dashboard-bug">Dashboard Bug / Not Working</option>
                                <option value="feature-request">Feature Request</option>
                                <option value="other">Other</option>
                            </select>
                            <textarea
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                required
                                rows={5}
                                placeholder="Please provide as much detail as possible about the issue you're facing..."
                                className="w-full input-field rounded-lg px-4 py-3"
                            />
                            <p className="text-xs text-[var(--text-secondary)]/80">
                                Note: Basic diagnostic information will be sent with your ticket to help us resolve your issue faster.
                            </p>
                        </main>
                        <footer className="p-4 text-right" style={{borderTop: '1px solid var(--border-color)'}}>
                             <button type="submit" disabled={submitting} className="btn-primary py-2 px-6 rounded-lg disabled:opacity-50">
                                {submitting ? 'Submitting...' : 'Submit Ticket'}
                            </button>
                        </footer>
                    </form>
                )}
            </div>
        </div>
    );
};

export default SupportTicketModal;
