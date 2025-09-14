import React, { useState, useEffect, useCallback } from 'react';
import { Business } from '../types';
import { addBusiness, getBusinesses, updateBusiness, getDashboardMetrics } from '../services/firebaseService';
import EditBusinessModal from './EditBusinessModal';
import { PencilIcon } from './icons/PencilIcon';
import { KeyIcon } from './icons/KeyIcon';
import SupportTicketsView from './SupportTicketsView';
import { BuildingStorefrontIcon } from './icons/BuildingStorefrontIcon';
import { ChatBubbleLeftRightIcon } from './icons/ChatBubbleLeftRightIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import UsageInsights from './UsageInsights';
import { ChartBarSquareIcon } from './icons/ChartBarSquareIcon';
import { LifebuoyIcon } from './icons/LifebuoyIcon';
import { CodeBracketIcon } from './icons/CodeBracketIcon';
import DeveloperSettings from './DeveloperSettings';

interface AgencyDashboardProps {
    onLogout: () => void;
}

const AgencyDashboard: React.FC<AgencyDashboardProps> = ({ onLogout }) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [newBusiness, setNewBusiness] = useState<Omit<Business, 'businessId' | 'products' | 'totalMessages'>>({
    businessName: '',
    city: '',
    businessCategory: '',
    businessInfo: '',
    characterName: '',
    businessWaNumber: '',
    shareImageUrl: '',
    profileImageUrl: '',
    websiteUrl: '',
    googleBusinessUrl: '',
    catalogueTitle: 'Our Catalogue',
    catalogueSubtitle: 'Browse our selection of products and services.',
    currency: 'INR',
    subscriptionExpiry: '',
    dashboardPin: '',
    announcementText: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState<{ type: string, id: string } | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [activeTab, setActiveTab] = useState('businesses');
  const [searchTerm, setSearchTerm] = useState('');
  const [metrics, setMetrics] = useState({ totalBusinesses: 0, totalMessages: 0, activeSubscriptions: 0, openTickets: 0 });
  const [insightsBusinessId, setInsightsBusinessId] = useState<string | null>(null);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
        const [businessesFromDb, dashboardMetrics] = await Promise.all([
            getBusinesses(),
            getDashboardMetrics()
        ]);
        setBusinesses(businessesFromDb);
        setMetrics(dashboardMetrics);
    } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewBusiness(prev => ({ ...prev, [name]: value }));
  };

  const handleAddBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBusiness.businessName || !newBusiness.city || !newBusiness.dashboardPin || !newBusiness.subscriptionExpiry) {
        alert("Please fill in all required fields: Business Name, City, PIN, and Subscription Expiry.");
        return;
    }
    setSubmitting(true);
    try {
      await addBusiness(newBusiness);
      setNewBusiness({
        businessName: '', city: '', businessCategory: '', businessInfo: '', characterName: '',
        businessWaNumber: '', shareImageUrl: '', profileImageUrl: '', websiteUrl: '', googleBusinessUrl: '',
        catalogueTitle: 'Our Catalogue', catalogueSubtitle: 'Browse our selection of products and services.',
        currency: 'INR', subscriptionExpiry: '', dashboardPin: '', announcementText: '',
      });
      await fetchAllData();
    } catch (error) {
        console.error("Error adding business:", error);
        alert("Failed to add business. Check the console for details.");
    }
    setSubmitting(false);
  };
  
  const handleCopy = (type: 'link' | 'pin', id: string) => {
    const business = businesses.find(b => b.businessId === id);
    if (!business) return;
    
    const textToCopy = type === 'link' ? `${window.location.origin}/?businessId=${id}` : business.dashboardPin;
    navigator.clipboard.writeText(textToCopy);
    setCopied({ type, id });
    setTimeout(() => setCopied(null), 2000);
  };

  const handleEdit = (business: Business) => {
    setEditingBusiness(business);
    setIsEditModalOpen(true);
  };

  const handleSave = async (updatedBusiness: Business) => {
    if (!editingBusiness) return;
    try {
        await updateBusiness(editingBusiness.businessId, updatedBusiness);
        setIsEditModalOpen(false);
        setEditingBusiness(null);
        await fetchAllData();
    } catch (error) {
        console.error("Error updating business:", error);
        alert("Failed to update business.");
    }
  };
  
  const filteredBusinesses = businesses.filter(b => b.businessName.toLowerCase().includes(searchTerm.toLowerCase()));
  
  const BusinessActions: React.FC<{ business: Business }> = ({ business }) => (
      <div className="flex items-center space-x-2">
        <button onClick={() => handleCopy('link', business.businessId)} className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors tooltip-container">
            <ChatBubbleLeftRightIcon className="w-4 h-4 text-gray-300" />
            <span className="tooltip-text">{copied?.type === 'link' && copied.id === business.businessId ? 'Copied!' : 'Copy Link'}</span>
        </button>
        <button onClick={() => handleCopy('pin', business.businessId)} className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors tooltip-container">
            <KeyIcon className="w-4 h-4 text-gray-300" />
             <span className="tooltip-text">{copied?.type === 'pin' && copied.id === business.businessId ? 'Copied!' : 'Copy PIN'}</span>
        </button>
        <button onClick={() => handleEdit(business)} className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors tooltip-container">
            <PencilIcon className="w-4 h-4 text-gray-300" />
            <span className="tooltip-text">Edit</span>
        </button>
         <button onClick={() => setInsightsBusinessId(insightsBusinessId === business.businessId ? null : business.businessId)} className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors tooltip-container">
            <ChartBarSquareIcon className="w-4 h-4 text-gray-300" />
            <span className="tooltip-text">Usage</span>
        </button>
    </div>
  );

  const renderContent = () => {
    if (loading) {
        return <div className="text-center p-8 text-[var(--text-secondary)]">Loading data...</div>;
    }
    switch (activeTab) {
      case 'tickets':
        return <SupportTicketsView onTicketUpdate={fetchAllData} />;
      case 'developer':
        return <DeveloperSettings />;
      case 'businesses':
      default:
        return (
          <>
            <div className="glass-card p-6 rounded-2xl mb-8">
              <h2 className="text-xl font-bold mb-4 text-white">Add New Business</h2>
              <form onSubmit={handleAddBusiness} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <input type="text" name="businessName" value={newBusiness.businessName} onChange={handleInputChange} placeholder="Business Name*" className="input-field rounded-lg p-2" required/>
                <input type="text" name="city" value={newBusiness.city} onChange={handleInputChange} placeholder="City*" className="input-field rounded-lg p-2" required/>
                <input type="text" name="dashboardPin" value={newBusiness.dashboardPin} onChange={handleInputChange} placeholder="Dashboard PIN*" className="input-field rounded-lg p-2" required/>
                <input type="date" name="subscriptionExpiry" value={newBusiness.subscriptionExpiry} onChange={handleInputChange} placeholder="Subscription Expiry*" className="input-field rounded-lg p-2" required/>
                <textarea name="businessInfo" value={newBusiness.businessInfo} onChange={handleInputChange} placeholder="Business Info for AI" rows={1} className="input-field rounded-lg p-2 lg:col-span-2" />
                <button type="submit" disabled={submitting} className="btn-primary rounded-lg p-2 w-full lg:col-span-3">
                  {submitting ? 'Adding...' : 'Add Business'}
                </button>
              </form>
            </div>
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                  <h2 className="text-xl font-bold text-white">Manage Businesses</h2>
                  <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input-field rounded-lg px-3 py-1.5 w-full sm:w-auto max-w-xs"
                  />
              </div>
              {/* Desktop Table View */}
              <div className="overflow-x-auto hidden md:block">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-900/50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Business Name</th>
                            <th scope="col" className="px-6 py-3">Subscription</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBusinesses.map(business => (
                            <tr key={business.businessId} className="border-b" style={{borderColor: 'var(--border-color)'}}>
                                <td className="px-6 py-4 font-medium text-white">{business.businessName}</td>
                                <td className="px-6 py-4 text-gray-300">{new Date(business.subscriptionExpiry).toLocaleDateString()}</td>
                                <td className="px-6 py-4"><BusinessActions business={business} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
              </div>
              {/* Mobile Card View */}
              <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredBusinesses.map(business => (
                    <div key={business.businessId} className="bg-gray-900/50 rounded-lg p-4 flex flex-col space-y-3">
                        <p className="font-bold text-white">{business.businessName}</p>
                        <p className="text-sm text-gray-400">Expires: {new Date(business.subscriptionExpiry).toLocaleDateString()}</p>
                        <BusinessActions business={business} />
                    </div>
                ))}
              </div>

            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-8" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold" style={{fontSize: '2.5rem'}}>Agency Dashboard</h1>
            <p className="text-gray-400">Hunnyspace Mission Control</p>
          </div>
          <button onClick={onLogout} className="btn-secondary font-semibold py-2 px-4 rounded-lg">
            Logout
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard title="Total Businesses" value={metrics.totalBusinesses} icon={<BuildingStorefrontIcon className="w-8 h-8"/>} />
            <MetricCard title="Total Messages" value={metrics.totalMessages.toLocaleString()} icon={<ChatBubbleLeftRightIcon className="w-8 h-8"/>} />
            <MetricCard title="Active Subscriptions" value={metrics.activeSubscriptions} icon={<SparklesIcon className="w-8 h-8"/>} />
            <MetricCard title="Open Tickets" value={metrics.openTickets} icon={<LifebuoyIcon className="w-8 h-8"/>} />
        </div>

        <div className="mb-8 overflow-x-auto">
            <div className="flex space-x-1 border-b" style={{borderColor: 'var(--border-color)'}}>
                <TabButton title="Businesses" active={activeTab === 'businesses'} onClick={() => setActiveTab('businesses')} />
                <TabButton title="Support Tickets" active={activeTab === 'tickets'} onClick={() => setActiveTab('tickets')} />
                <TabButton title="Developer" active={activeTab === 'developer'} onClick={() => setActiveTab('developer')} />
            </div>
        </div>

        {renderContent()}

      </div>
      {isEditModalOpen && editingBusiness && (
        <EditBusinessModal 
          business={editingBusiness} 
          onClose={() => setIsEditModalOpen(false)} 
          onSave={handleSave} 
        />
      )}
      <style>{`
        .tooltip-container { position: relative; }
        .tooltip-text {
            visibility: hidden;
            width: 80px;
            background-color: #1F2937;
            color: #fff;
            text-align: center;
            border-radius: 6px;
            padding: 5px 0;
            position: absolute;
            z-index: 1;
            bottom: 125%;
            left: 50%;
            margin-left: -40px;
            opacity: 0;
            transition: opacity 0.3s;
        }
        .tooltip-container:hover .tooltip-text {
            visibility: visible;
            opacity: 1;
        }
      `}</style>
    </div>
  );
};

const MetricCard: React.FC<{title: string, value: string | number, icon: React.ReactNode}> = ({ title, value, icon }) => (
    <div className="glass-card p-5 rounded-2xl flex items-center space-x-4">
        <div className="p-3 rounded-full bg-gray-900/50">
            <span className="text-blue-400">{icon}</span>
        </div>
        <div>
            <p className="text-gray-400 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const TabButton: React.FC<{title: string, active: boolean, onClick: () => void}> = ({ title, active, onClick }) => (
    <button
        onClick={onClick}
        className={`py-3 px-5 font-semibold text-sm transition-colors whitespace-nowrap ${active ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}
    >
        {title}
    </button>
);

export default AgencyDashboard;
