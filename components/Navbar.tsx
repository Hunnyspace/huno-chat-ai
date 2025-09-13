import React from 'react';
import { AGENCY_WHATSAPP_NUMBER } from '../constants';

const Navbar: React.FC = () => {
  const agencyWaLink = `https://wa.me/${AGENCY_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello! I'm interested in Hunnyspace's AI solutions.")}`;

  return (
    <nav className="sticky top-0 z-50" style={{ background: 'rgba(10, 15, 31, 0.5)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-color)'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-transparent bg-clip-text" style={{ backgroundImage: 'var(--accent-gradient)'}}>
              Hunnyspace
            </a>
          </div>
          <div className="flex items-center space-x-4">
             <a href="/dashboard" className="text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-colors">
              Agency Dashboard
            </a>
            <a href="/client-login" className="text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-colors">
              Client Login
            </a>
            <a 
              href={agencyWaLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm rounded-lg btn-primary"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
