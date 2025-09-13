import React from 'react';
import { Business, Product } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import CountdownTimer from './CountdownTimer';

interface ProductCatalogueModalProps {
  business: Business;
  onClose: () => void;
}

const currencySymbols = {
  USD: '$',
  INR: '₹',
  EUR: '€',
  GBP: '£',
};

const ProductCard: React.FC<{ product: Product, business: Business }> = ({ product, business }) => {
    const { businessWaNumber, currency } = business;
    const isOfferValid = product.offer && product.offer.expiry && new Date(product.offer.expiry) > new Date();

    const handleWhatsAppClick = () => {
        const message = product.type === 'product'
            ? `Hi, I'm interested in buying the '${product.name}'.`
            : `Hi, I'd like to inquire about the '${product.name}' service.`;
        const waLink = `https://wa.me/${businessWaNumber}?text=${encodeURIComponent(message)}`;
        window.open(waLink, '_blank', 'noopener,noreferrer');
    };

    const currencySymbol = currencySymbols[currency] || '$';

    return (
        <div key={product.id} className="bg-[var(--bg-secondary)] rounded-xl overflow-hidden border border-[var(--border-color)] flex flex-col transition-all duration-300 hover:border-[var(--accent-primary)]/80 hover:shadow-[0_0_25px_rgba(212,175,55,0.15)] transform hover:-translate-y-1">
          <div className="relative">
            {isOfferValid && (
              <div className="absolute top-0 left-0 w-full bg-red-600/90 text-white text-center py-1.5 px-4 z-10">
                  <CountdownTimer expiryTimestamp={product.offer!.expiry} />
              </div>
            )}
            <img src={product.imageUrl} alt={product.name} className="w-full h-56 object-cover"/>
          </div>
          <div className="p-5 flex flex-col flex-grow">
            <h3 className="font-bold text-xl text-white">{product.name}</h3>
            <p className="text-[var(--text-secondary)] text-sm mt-2 mb-4 flex-grow">{product.description}</p>
            <div className="flex justify-between items-center mt-auto">
              <div>
                {isOfferValid ? (
                    <div className="flex items-baseline space-x-2">
                        <p className="font-bold text-2xl" style={{color: 'var(--accent-secondary)'}}>{currencySymbol}{product.offer!.newPrice.toFixed(2)}</p>
                        <p className="text-slate-500 line-through text-md">{currencySymbol}{product.price.toFixed(2)}</p>
                    </div>
                ) : (
                    <p className="font-bold text-2xl" style={{color: 'var(--accent-secondary)'}}>{currencySymbol}{product.price.toFixed(2)}</p>
                )}
              </div>
              {product.type === 'product' && <p className="text-xs font-semibold text-[var(--text-secondary)] bg-[var(--bg-primary)]/50 px-2 py-1 rounded-md">{product.stock} in stock</p>}
            </div>
          </div>
          <div className="p-4 bg-[var(--bg-primary)]/50 border-t border-[var(--border-color)]/50">
            <button
              onClick={handleWhatsAppClick}
              className="w-full flex items-center justify-center bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-500 transition-all duration-200"
            >
              <WhatsAppIcon className="w-5 h-5 mr-2" />
              {product.type === 'product' ? 'Buy on WhatsApp' : 'Inquire on WhatsApp'}
            </button>
          </div>
        </div>
    );
};


const ProductCatalogueModal: React.FC<ProductCatalogueModalProps> = ({ business, onClose }) => {
  const { products, catalogueTitle, catalogueSubtitle } = business;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="catalogue-title">
      <div className="glass-pane rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        <header className="p-5 flex justify-between items-center border-b" style={{borderColor: 'var(--border-color)'}}>
          <div>
            <h2 id="catalogue-title" className="text-2xl font-bold" style={{color: 'var(--accent-secondary)'}}>{catalogueTitle}</h2>
            <p className="text-sm text-[var(--text-secondary)]">{catalogueSubtitle}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors" aria-label="Close modal">
            <XMarkIcon className="w-6 h-6 text-[var(--text-secondary)]" />
          </button>
        </header>

        <main className="p-6 overflow-y-auto">
          {(!products || products.length === 0) ? (
            <div className="text-center py-16">
              <p className="text-[var(--text-secondary)] text-lg">No products or services available right now.</p>
              <p className="text-slate-500 text-sm mt-2">Please check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} business={business} />
              ))}
            </div>
          )}
        </main>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
      `}</style>
    </div>
  );
};

export default ProductCatalogueModal;
