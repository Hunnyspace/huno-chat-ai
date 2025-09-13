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

interface AgencyDashboardProps {
    onLogout: () => void;
}

const AgencyDashboard: React.FC<AgencyDashboardProps> = ({ onLogout }) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  // Fix: The `addBusiness` function initializes `totalMessages`, so it should not be part of the form state.
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
  const [metrics, setMetrics] = useState({ totalBusinesses: 0, totalMessages: 0, activeSubscriptions: 0 });
  const [insightsBusinessId, setInsightsBusinessId] = useState<string | null>(null);

  const fetchBusinesses = useCallback(async () => {
    setLoading(true);
    const businessesFromDb = await getBusinesses();
    setBusinesses(businessesFromDb);
    const dashboardMetrics = await getDashboardMetrics();
    setMetrics(dashboardMetrics);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewBusiness(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addBusiness(newBusiness);
      // Fix: The `addBusiness` function initializes `totalMessages`, so it should not be part of the form state reset.
      setNewBusiness({
        businessName: '', city: '', businessCategory: '', businessInfo: '',
        characterName: '', businessWaNumber: '', shareImageUrl: '',
        profileImageUrl: '', websiteUrl: '', googleBusinessUrl: '',
        catalogueTitle: 'Our Catalogue', catalogueSubtitle: 'Browse our selection of products and services.',
        currency: 'INR', subscriptionExpiry: '', dashboardPin: '', announcementText: '',
      });
      await fetchBusinesses();
    } catch (error)
    {
      console.error("Failed to add business:", error);
      alert("Error adding business. Please check the console.");
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleCopy = (type: 'link' | 'creds', business: Business) => {
    let textToCopy = '';
    if (type === 'link') {
        textToCopy = `${window.location.origin}/?businessId=${business.businessId}`;
    } else {
        textToCopy = `Business ID: ${business.businessId}\nPIN: ${business.dashboardPin}`;
    }
    navigator.clipboard.writeText(textToCopy);
    setCopied({ type, id: business.businessId });
    setTimeout(() => setCopied(null), 2000);
  };

  const handleEditClick = (business: Business) => {
    setEditingBusiness(business);
    setIsEditModalOpen(true);
  };
  
  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setEditingBusiness(null);
  };

  const handleModalSave = async (updatedBusiness: Business) => {
    if (!updatedBusiness) return;
    try {
      await updateBusiness(updatedBusiness.businessId, updatedBusiness);
      await fetchBusinesses();
      handleModalClose();
    } catch (error) {
      console.error("Failed to update business:", error);
      alert("Error updating business. Please check the console.");
    }
  };

  const toggleInsights = (businessId: string) => {
    setInsightsBusinessId(prevId => prevId === businessId ? null : businessId);
  }

  const filteredBusinesses = businesses.filter(b => 
    b.businessName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="p-4 sm:p-8 min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 max-w-7xl mx-auto">
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg, var(--accent-secondary), var(--accent-primary))'}}>
              Agency Dashboard
            </h1>
            <p className="text-[var(--text-secondary)] mt-1">Hunnyspace Mission Control</p>
          </div>
          <button onClick={onLogout} className="mt-4 sm:mt-0 font-semibold py-2 px-4 rounded-lg btn-secondary hover:bg-red-600/20 hover:border-red-500/50">
            Logout
          </button>
        </header>

        <div className="max-w-7xl mx-auto">
            {/* Metrics */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-pane p-6 rounded-2xl flex items-center space-x-4">
                    <BuildingStorefrontIcon className="w-8 h-8 text-[var(--accent-primary)]" />
                    <div>
                        <p className="text-sm text-[var(--text-secondary)]">Total Businesses</p>
                        <p className="text-3xl font-bold text-white">{loading ? '...' : metrics.totalBusinesses}</p>
                    </div>
                </div>
                <div className="glass-pane p-6 rounded-2xl flex items-center space-x-4">
                    <ChatBubbleLeftRightIcon className="w-8 h-8 text-[var(--accent-primary)]" />
                    <div>
                        <p className="text-sm text-[var(--text-secondary)]">Messages Delivered</p>
                        <p className="text-3xl font-bold text-white">{loading ? '...' : metrics.totalMessages.toLocaleString()}</p>
                    </div>
                </div>
                <div className="glass-pane p-6 rounded-2xl flex items-center space-x-4">
                    <SparklesIcon className="w-8 h-8 text-[var(--accent-primary)]" />
                    <div>
                        <p className="text-sm text-[var(--text-secondary)]">Active Subscriptions</p>
                        <p className="text-3xl font-bold text-white">{loading ? '...' : metrics.activeSubscriptions}</p>
                    </div>
                </div>
            </section>


            <div className="border-b border-[var(--border-color)] mb-6">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button onClick={() => setActiveTab('businesses')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'businesses' ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-white hover:border-gray-500'}`}>
                        Business Management
                    </button>
                    <button onClick={() => setActiveTab('support')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'support' ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-white hover:border-gray-500'}`}>
                        Support Tickets
                    </button>
                </nav>
            </div>

            {activeTab === 'businesses' && (
              <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Add Business Form */}
                <div className="glass-card p-6 rounded-2xl">
                  <h2 className="text-2xl font-bold mb-6" style={{color: 'var(--accent-secondary)'}}>Add New Business</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="businessName" value={newBusiness.businessName} onChange={handleInputChange} placeholder="e.g., Dr. Varma's Wellness Clinic" required className="w-full input-field rounded-lg px-4 py-2" />
                    <input type="text" name="city" value={newBusiness.city} onChange={handleInputChange} placeholder="e.g., Hyderabad" required className="w-full input-field rounded-lg px-4 py-2" />
                    <input type="text" name="businessCategory" value={newBusiness.businessCategory} onChange={handleInputChange} placeholder="e.g., Homoeopathy Clinic" required className="w-full input-field rounded-lg px-4 py-2" />
                    <textarea name="businessInfo" value={newBusiness.businessInfo} onChange={handleInputChange} placeholder="Business Info for AI (services, hours, contact details...)" required rows={4} className="w-full input-field rounded-lg px-4 py-2" />
                    <input type="text" name="characterName" value={newBusiness.characterName} onChange={handleInputChange} placeholder="AI Character Name (e.g., 'Dr. VEE')" required className="w-full input-field rounded-lg px-4 py-2" />
                    <input type="text" name="businessWaNumber" value={newBusiness.businessWaNumber} onChange={handleInputChange} placeholder="Business WhatsApp Number (+91...)" required className="w-full input-field rounded-lg px-4 py-2" />
                    <input type="url" name="profileImageUrl" value={newBusiness.profileImageUrl} onChange={handleInputChange} placeholder="Profile Image URL (for Chat Avatar)" required className="w-full input-field rounded-lg px-4 py-2" />
                    <input type="url" name="shareImageUrl" value={newBusiness.shareImageUrl} onChange={handleInputChange} placeholder="Image URL for Social Sharing Previews" required className="w-full input-field rounded-lg px-4 py-2" />
                    <input type="url" name="websiteUrl" value={newBusiness.websiteUrl || ''} onChange={handleInputChange} placeholder="Website URL (Optional)" className="w-full input-field rounded-lg px-4 py-2" />
                    <input type="url" name="googleBusinessUrl" value={newBusiness.googleBusinessUrl || ''} onChange={handleInputChange} placeholder="Google Business URL (Optional)" className="w-full input-field rounded-lg px-4 py-2" />
                    <input type="text" name="catalogueTitle" value={newBusiness.catalogueTitle} onChange={handleInputChange} placeholder="Custom Catalogue Title" required className="w-full input-field rounded-lg px-4 py-2" />
                    <input type="text" name="catalogueSubtitle" value={newBusiness.catalogueSubtitle} onChange={handleInputChange} placeholder="Custom Catalogue Subtitle" required className="w-full input-field rounded-lg px-4 py-2" />
                    <input type="text" name="announcementText" value={newBusiness.announcementText || ''} onChange={handleInputChange} placeholder="Scrolling Announcement Text (Optional)" className="w-full input-field rounded-lg px-4 py-2" />
                      <div className="grid grid-cols-2 gap-4">
                        <select name="currency" value={newBusiness.currency} onChange={handleInputChange} className="w-full input-field rounded-lg px-4 py-2">
                          <option value="INR">INR (₹)</option>
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                        </select>
                        <input type="date" name="subscriptionExpiry" value={newBusiness.subscriptionExpiry} onChange={handleInputChange} placeholder="Subscription Expiry" className="w-full input-field rounded-lg px-4 py-2" />
                    </div>
                    <input type="text" name="dashboardPin" value={newBusiness.dashboardPin} onChange={handleInputChange} placeholder="Client Dashboard PIN (4-6 digits)" required className="w-full input-field rounded-lg px-4 py-2" />

                    <button type="submit" disabled={submitting} className="w-full btn-primary py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                      {submitting ? 'Adding...' : 'Add Business'}
                    </button>
                  </form>
                </div>

                {/* Business List */}
                <div className="glass-card p-6 rounded-2xl flex flex-col">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold" style={{color: 'var(--accent-secondary)'}}>Managed Businesses</h2>
                         <input
                            type="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Find a business..."
                            className="w-full input-field rounded-lg px-4 py-2 mt-4"
                        />
                    </div>
                  
                  {loading ? (
                    <div className="text-center text-[var(--text-secondary)]">Loading businesses...</div>
                  ) : filteredBusinesses.length === 0 ? (
                    <div className="text-center text-[var(--text-secondary)]">No businesses found.</div>
                  ) : (
                    <ul className="space-y-4 overflow-y-auto">
                      {filteredBusinesses.map(business => (
                        <li key={business.businessId} className="p-4 rounded-lg flex flex-col transition-all duration-300" style={{backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)'}}>
                          <div className="flex flex-col sm:flex-row justify-between items-center">
                            <div>
                              <h3 className="font-bold text-lg text-white">{business.businessName}</h3>
                              <p className="text-[var(--text-secondary)]">{business.city}</p>
                            </div>
                            <div className="flex items-center space-x-2 mt-3 sm:mt-0 w-full sm:w-auto">
                                <button onClick={() => handleCopy('creds', business)} className="flex items-center justify-center w-full sm:w-auto py-2 px-3 rounded-lg text-sm font-semibold btn-secondary" title="Copy Credentials">
                                    <KeyIcon className="w-4 h-4 mr-2" /> {copied?.type === 'creds' && copied.id === business.businessId ? 'Copied!' : 'Creds'}
                                </button>
                                <button onClick={() => toggleInsights(business.businessId)} className="flex items-center justify-center w-full sm:w-auto py-2 px-3 rounded-lg text-sm font-semibold btn-secondary" title="Usage Insights">
                                    <ChartBarSquareIcon className="w-4 h-4 mr-2" /> Insights
                                </button>
                                <button onClick={() => handleEditClick(business)} className="flex items-center justify-center w-full sm:w-auto py-2 px-3 rounded-lg text-sm font-semibold btn-secondary" title="Edit Business">
                                  <PencilIcon className="w-4 h-4 mr-2" /> Edit
                                </button>
                                <button onClick={() => handleCopy('link', business)} className="w-full sm:w-auto py-2 px-4 rounded-lg text-sm btn-primary">
                                  {copied?.type === 'link' && copied.id === business.businessId ? 'Copied!' : 'Copy Link'}
                                </button>
                            </div>
                          </div>
                          {insightsBusinessId === business.businessId && (
                            <UsageInsights businessId={business.businessId} />
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </main>
            )}

            {activeTab === 'support' && (
                <SupportTicketsView />
            )}
        </div>
      </div>
      {isEditModalOpen && editingBusiness && (
        <EditBusinessModal
          business={editingBusiness}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </>
  );
};

export default AgencyDashboard;