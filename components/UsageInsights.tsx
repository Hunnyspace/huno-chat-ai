import React, { useState, useEffect } from 'react';
import { getUsageForBusiness, getChatSessionsForBusiness } from '../services/firebaseService';
import { UsageMetrics } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { PencilSquareIcon } from './icons/PencilSquareIcon';
import { CircleStackIcon } from './icons/CircleStackIcon';

interface UsageInsightsProps {
    businessId: string;
}

const MetricCard: React.FC<{ title: string; value: string; icon: React.ReactNode; }> = ({ title, value, icon }) => (
    <div className="bg-[var(--bg-primary)] p-4 rounded-lg flex items-center space-x-3">
        <div className="text-[var(--accent-primary)]">{icon}</div>
        <div>
            <p className="text-xs text-[var(--text-secondary)] font-medium">{title}</p>
            <p className="text-lg font-bold text-white">{value}</p>
        </div>
    </div>
);

const UsageInsights: React.FC<UsageInsightsProps> = ({ businessId }) => {
    const [metrics, setMetrics] = useState<UsageMetrics | null>(null);
    const [totalSessions, setTotalSessions] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInsights = async () => {
            setLoading(true);
            try {
                const usageData = await getUsageForBusiness(businessId);
                const sessionData = await getChatSessionsForBusiness(businessId, false); // Don't log this agency-side read
                setMetrics(usageData);
                setTotalSessions(sessionData.length);
            } catch (error) {
                console.error("Failed to fetch usage insights:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInsights();
    }, [businessId]);

    if (loading) {
        return <div className="text-center p-4 text-xs text-[var(--text-secondary)] animate-pulse">Loading insights...</div>;
    }

    if (!metrics) {
        return <div className="text-center p-4 text-xs text-[var(--text-secondary)]">Could not load usage data.</div>;
    }

    return (
        <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
            <h4 className="text-sm font-bold text-[var(--accent-secondary)] mb-3">Usage Insights (Last 30 Days)</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MetricCard 
                    title="Gemini Tokens (Est.)" 
                    value={metrics.geminiTokens.toLocaleString()}
                    icon={<SparklesIcon className="w-6 h-6" />}
                />
                <MetricCard 
                    title="Firestore Reads" 
                    value={metrics.firestoreReads.toLocaleString()}
                    icon={<DocumentTextIcon className="w-6 h-6" />}
                />
                <MetricCard 
                    title="Firestore Writes" 
                    value={metrics.firestoreWrites.toLocaleString()}
                    icon={<PencilSquareIcon className="w-6 h-6" />}
                />
                <MetricCard 
                    title="Total Sessions (Storage)" 
                    value={totalSessions?.toLocaleString() ?? '...'}
                    icon={<CircleStackIcon className="w-6 h-6" />}
                />
            </div>
        </div>
    );
};

export default UsageInsights;
