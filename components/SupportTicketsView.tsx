import React, { useState, useEffect, useCallback } from 'react';
import { Ticket } from '../types';
import { getSupportTickets, updateTicketStatus } from '../services/firebaseService';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ArchiveBoxIcon } from './icons/ArchiveBoxIcon';

const SupportTicketsView: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

    const fetchTickets = useCallback(async () => {
        setLoading(true);
        try {
            const fetchedTickets = await getSupportTickets();
            setTickets(fetchedTickets);
        } catch (error) {
            console.error("Failed to fetch tickets:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const handleStatusChange = async (ticketId: string, status: 'open' | 'closed') => {
        try {
            await updateTicketStatus(ticketId, status);
            fetchTickets(); // Refresh the list
        } catch (error) {
            console.error("Failed to update ticket status:", error);
            alert("Could not update ticket status.");
        }
    };

    if (loading) {
        return <div className="text-center p-8 text-[var(--text-secondary)]">Loading tickets...</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 glass-card p-4 rounded-2xl">
                <h2 className="text-xl font-bold mb-4" style={{color: 'var(--accent-secondary)'}}>Ticket Queue</h2>
                {tickets.length === 0 ? (
                    <p className="text-sm text-[var(--text-secondary)]">No support tickets found.</p>
                ) : (
                    <ul className="space-y-2">
                        {tickets.map(ticket => (
                            <li key={ticket.id}>
                                <button 
                                    onClick={() => setSelectedTicket(ticket)}
                                    className={`w-full text-left p-3 rounded-lg transition-colors ${selectedTicket?.id === ticket.id ? 'bg-[var(--accent-primary)]/30' : 'bg-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)]/60'}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-sm truncate">{ticket.businessName}</p>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ticket.status === 'open' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'}`}>
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-[var(--text-secondary)] mt-1">{ticket.issue}</p>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="md:col-span-2 glass-card p-6 rounded-2xl">
                {selectedTicket ? (
                    <div>
                        <div className="pb-4 border-b border-[var(--border-color)] mb-4">
                            <h3 className="text-xl font-bold text-white">{selectedTicket.businessName}</h3>
                            <p className="text-sm text-[var(--text-secondary)]">
                                Submitted on {new Date(selectedTicket.createdAt.toDate()).toLocaleString()}
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-sm text-[var(--accent-secondary)]">Category</h4>
                                <p className="p-2 rounded-md bg-[var(--bg-secondary)] text-sm mt-1">{selectedTicket.issue}</p>
                            </div>
                             <div>
                                <h4 className="font-semibold text-sm text-[var(--accent-secondary)]">Details</h4>
                                <p className="p-2 rounded-md bg-[var(--bg-secondary)] text-sm mt-1 whitespace-pre-wrap">{selectedTicket.details}</p>
                            </div>
                             <div>
                                <h4 className="font-semibold text-sm text-[var(--accent-secondary)]">Diagnostic Logs</h4>
                                <pre className="p-2 rounded-md bg-[var(--bg-primary)] text-xs mt-1 text-gray-400 overflow-x-auto">{selectedTicket.logs}</pre>
                            </div>
                            <div className="pt-4 border-t border-[var(--border-color)] text-right">
                                {selectedTicket.status === 'open' ? (
                                    <button onClick={() => handleStatusChange(selectedTicket.id, 'closed')} className="btn-primary inline-flex items-center py-2 px-4 rounded-lg">
                                        <CheckCircleIcon className="w-5 h-5 mr-2" /> Mark as Resolved
                                    </button>
                                ) : (
                                    <button onClick={() => handleStatusChange(selectedTicket.id, 'open')} className="btn-secondary inline-flex items-center py-2 px-4 rounded-lg">
                                        <ArchiveBoxIcon className="w-5 h-5 mr-2" /> Re-open Ticket
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-center">
                        <p className="text-[var(--text-secondary)]">Select a ticket to view its details.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupportTicketsView;
