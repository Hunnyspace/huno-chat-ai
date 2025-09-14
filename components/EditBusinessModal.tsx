import React, { useState, useEffect } from 'react';
import { Business, Product } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface EditBusinessModalProps {
  business: Business;
  onClose: () => void;
  onSave: (updatedBusiness: Business) => void;
}

const EditBusinessModal: React.FC<EditBusinessModalProps> = ({ business, onClose, onSave }) => {
  const [formData, setFormData] = useState<Business>(business);

  useEffect(() => {
    const defaults = {
        businessEmail: '',
        catalogueTitle: 'Our Catalogue',
        catalogueSubtitle: 'Browse our selection of products and services.',
        currency: 'INR',
        profileImageUrl: '',
        websiteUrl: '',
        googleBusinessUrl: '',
        subscriptionExpiry: '',
        products: [],
        dashboardPin: '',
        announcementText: '',
        geminiApiKey: '',
    };
    setFormData({ ...defaults, ...business });
  }, [business]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedProducts = [...(formData.products || [])];
    const product = { ...updatedProducts[index] };
    
    const [field, subfield] = name.split('.');

    if (subfield) {
        const baseOffer = product.offer || { newPrice: 0, expiry: '' };
        if (subfield === 'newPrice') {
            product.offer = { ...baseOffer, newPrice: Number(value) || 0 };
        } else if (subfield === 'expiry') {
            product.offer = { ...baseOffer, expiry: value };
        }
    } else if (name === 'price' || name === 'stock') {
        (product as any)[name] = Number(value) || 0;
    }
    else {
        (product as any)[name] = value;
    }
    
    updatedProducts[index] = product;
    setFormData(prev => ({ ...prev, products: updatedProducts }));
  };

  const addProduct = () => {
    const newProduct: Product = { id: crypto.randomUUID(), name: '', description: '', price: 0, stock: 0, imageUrl: '', type: 'product' };
    setFormData(prev => ({ ...prev, products: [...(prev.products || []), newProduct] }));
  };

  const removeProduct = (index: number) => {
    const updatedProducts = [...(formData.products || [])];
    updatedProducts.splice(index, 1);
    setFormData(prev => ({ ...prev, products: updatedProducts }));
  };
  
  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="edit-business-title">
      <div className="glass-pane rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <header className="p-4 flex justify-between items-center" style={{ borderBottom: '1px solid var(--border-color)'}}>
          <h2 id="edit-business-title" className="text-2xl font-bold" style={{color: 'var(--accent-secondary)'}}>Edit {business.businessName}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors" aria-label="Close modal">
            <XMarkIcon className="w-6 h-6 text-[var(--text-secondary)]" />
          </button>
        </header>

        <main className="p-6 overflow-y-auto space-y-6">
          <section className="space-y-4">
            <h3 className="text-xl font-bold border-b pb-2" style={{color: 'var(--accent-secondary)', borderColor: 'var(--border-color)'}}>Business Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} placeholder="Business Name" className="w-full input-field rounded-lg px-4 py-2" />
              <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="City" className="w-full input-field rounded-lg px-4 py-2" />
               <input type="email" name="businessEmail" value={formData.businessEmail} onChange={handleInputChange} placeholder="Business Email (for login)" className="w-full input-field rounded-lg px-4 py-2" required/>
              <input type="text" name="businessCategory" value={formData.businessCategory} onChange={handleInputChange} placeholder="e.g., Homoeopathy Clinic" className="w-full input-field rounded-lg px-4 py-2" />
              <input type="text" name="characterName" value={formData.characterName} onChange={handleInputChange} placeholder="AI Character Name" className="w-full input-field rounded-lg px-4 py-2" />
              <input type="text" name="businessWaNumber" value={formData.businessWaNumber} onChange={handleInputChange} placeholder="WhatsApp Number (+91...)" className="w-full input-field rounded-lg px-4 py-2" />
              <input type="text" name="dashboardPin" value={formData.dashboardPin} onChange={handleInputChange} placeholder="Client Dashboard PIN" className="w-full input-field rounded-lg px-4 py-2" />
              <textarea name="businessInfo" value={formData.businessInfo} onChange={handleInputChange} placeholder="Business Info for AI (services, hours, etc.)" rows={5} className="md:col-span-2 w-full input-field rounded-lg px-4 py-2" />
            </div>
             <h3 className="text-xl font-bold border-b pb-2 pt-4" style={{color: 'var(--accent-secondary)', borderColor: 'var(--border-color)'}}>Branding & Links</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <input type="url" name="profileImageUrl" value={formData.profileImageUrl} onChange={handleInputChange} placeholder="Profile Image URL (for Chat Avatar)" className="w-full input-field rounded-lg px-4 py-2" />
                 <input type="url" name="shareImageUrl" value={formData.shareImageUrl} onChange={handleInputChange} placeholder="Social Sharing Image URL" className="w-full input-field rounded-lg px-4 py-2" />
                 <input type="url" name="websiteUrl" value={formData.websiteUrl || ''} onChange={handleInputChange} placeholder="Website URL (https://...)" className="w-full input-field rounded-lg px-4 py-2" />
                 <input type="url" name="googleBusinessUrl" value={formData.googleBusinessUrl || ''} onChange={handleInputChange} placeholder="Google Business URL (https://...)" className="w-full input-field rounded-lg px-4 py-2" />
                 <input type="text" name="catalogueTitle" value={formData.catalogueTitle} onChange={handleInputChange} placeholder="Custom Catalogue Title" className="w-full input-field rounded-lg px-4 py-2" />
                 <input type="text" name="catalogueSubtitle" value={formData.catalogueSubtitle} onChange={handleInputChange} placeholder="Custom Catalogue Subtitle" className="w-full input-field rounded-lg px-4 py-2" />
                 <textarea name="announcementText" value={formData.announcementText || ''} onChange={handleInputChange} placeholder="Scrolling Announcement Text (Optional)" rows={2} className="md:col-span-2 w-full input-field rounded-lg px-4 py-2" />
             </div>
             <h3 className="text-xl font-bold border-b pb-2 pt-4" style={{color: 'var(--accent-secondary)', borderColor: 'var(--border-color)'}}>Subscription & Advanced</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <input type="date" name="subscriptionExpiry" value={formData.subscriptionExpiry} onChange={handleInputChange} placeholder="Subscription Expiry" className="w-full input-field rounded-lg px-4 py-2" />
                 <select name="currency" value={formData.currency} onChange={handleInputChange} className="w-full input-field rounded-lg px-4 py-2">
                     <option value="INR">INR (₹)</option>
                     <option value="USD">USD ($)</option>
                     <option value="EUR">EUR (€)</option>
                     <option value="GBP">GBP (£)</option>
                 </select>
                  <div className="md:col-span-2">
                    <input 
                        type="password" 
                        name="geminiApiKey" 
                        value={formData.geminiApiKey || ''} 
                        onChange={handleInputChange} 
                        placeholder="Client's Gemini API Key (Optional)" 
                        className="w-full input-field rounded-lg px-4 py-2" 
                    />
                    <p className="text-xs text-gray-400 mt-1 pl-1">If provided, this key will be used for this business instead of the agency's default key.</p>
                  </div>
              </div>
          </section>

          {/* Product Catalogue */}
          <section className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2" style={{borderColor: 'var(--border-color)'}}>
              <h3 className="text-xl font-bold" style={{color: 'var(--accent-secondary)'}}>Product Catalogue</h3>
              <button onClick={addProduct} className="flex items-center btn-primary py-2 px-4 rounded-lg">
                <PlusIcon className="w-5 h-5 mr-1" /> Add
              </button>
            </div>
            <div className="space-y-4">
              {(formData.products || []).map((product, index) => (
                <div key={product.id} className="p-4 rounded-lg space-y-3" style={{backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)'}}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input type="text" name="name" value={product.name} onChange={(e) => handleProductChange(index, e)} placeholder="Product/Service Name" className="w-full input-field bg-[var(--bg-primary)] rounded-md p-2" />
                        <select name="type" value={product.type} onChange={(e) => handleProductChange(index, e)} className="w-full input-field bg-[var(--bg-primary)] rounded-md p-2">
                            <option value="product">Product</option>
                            <option value="service">Service</option>
                        </select>
                    </div>
                    <input type="url" name="imageUrl" value={product.imageUrl} onChange={(e) => handleProductChange(index, e)} placeholder="Image URL (https://...)" className="w-full input-field bg-[var(--bg-primary)] rounded-md p-2" />
                    <textarea name="description" value={product.description} onChange={(e) => handleProductChange(index, e)} placeholder="Description" rows={2} className="w-full input-field bg-[var(--bg-primary)] rounded-md p-2" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <input type="number" name="price" value={product.price} onChange={(e) => handleProductChange(index, e)} placeholder="Price" className="w-full input-field bg-[var(--bg-primary)] rounded-md p-2" />
                         {product.type === 'product' && (
                           <input type="number" name="stock" value={product.stock} onChange={(e) => handleProductChange(index, e)} placeholder="Stock" className="w-full input-field bg-[var(--bg-primary)] rounded-md p-2" />
                         )}
                        <input type="number" name="offer.newPrice" value={product.offer?.newPrice || ''} onChange={(e) => handleProductChange(index, e)} placeholder="Offer Price (optional)" className="w-full input-field bg-[var(--bg-primary)] rounded-md p-2" />
                        <input type="datetime-local" name="offer.expiry" value={product.offer?.expiry ? product.offer.expiry.substring(0, 16) : ''} onChange={(e) => handleProductChange(index, e)} placeholder="Offer Expiry" className="w-full input-field bg-[var(--bg-primary)] rounded-md p-2" />
                    </div>
                    <div className="text-right">
                        <button onClick={() => removeProduct(index)} className="flex items-center text-red-400 hover:text-red-300 text-sm font-semibold">
                            <TrashIcon className="w-4 h-4 mr-1" /> Remove
                        </button>
                    </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <footer className="p-4 flex justify-end space-x-3" style={{ borderTop: '1px solid var(--border-color)', background: 'rgba(10, 15, 31, 0.5)'}}>
          <button onClick={onClose} className="btn-secondary font-bold py-2 px-6 rounded-lg">
            Cancel
          </button>
          <button onClick={handleSave} className="btn-primary py-2 px-6 rounded-lg">
            Save Changes
          </button>
        </footer>
      </div>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
      `}</style>
    </div>
  );
};

export default EditBusinessModal;