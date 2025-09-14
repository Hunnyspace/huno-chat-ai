import React from 'react';
import Navbar from './Navbar';
import { AGENCY_WHATSAPP_NUMBER, AGENCY_WHATSAPP_PREFILL_MESSAGE } from '../constants';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

const Homepage: React.FC = () => {
    const agencyWaLink = `https://wa.me/${AGENCY_WHATSAPP_NUMBER}?text=${encodeURIComponent(AGENCY_WHATSAPP_PREFILL_MESSAGE)}`;

    const features = [
        { 
            title: "24/7 AI-Powered Conversations", 
            description: "Deploy a tireless AI assistant trained on your specific business data. It provides instant, accurate answers to customer queries anytime, day or night, improving satisfaction and freeing up your team.", 
            icon: "💬" 
        },
        { 
            title: "Automated Lead Generation", 
            description: "Transform your website traffic into qualified leads. The AI intelligently identifies potential customers, gathers their information, and seamlessly guides them to your sales funnel or a direct WhatsApp conversation.", 
            icon: "🚀" 
        },
        { 
            title: "Advanced Multimodal Chat", 
            description: "Go beyond text. Allow customers to interact using voice commands or by sending images for queries. Our AI can understand and respond, creating a richer, more accessible user experience.", 
            icon: "🎤" 
        },
        { 
            title: "Interactive Product Catalogues", 
            description: "Showcase your products and services directly within the chat. Users can browse, ask questions, and be guided to purchase via WhatsApp, turning conversations into conversions.", 
            icon: "🛍️" 
        },
        { 
            title: "Powerful Client Dashboard", 
            description: "Provide your clients with their own secure portal. They can view detailed chat analytics, read conversation transcripts, and gain AI-powered insights to understand their customers better.", 
            icon: "📊" 
        },
        { 
            title: "Full Brand Customization", 
            description: "Strengthen your brand identity. Customize the AI's name, personality, and avatar. Your chat links will feature rich social media previews with your logo and branding, ensuring a professional look.", 
            icon: "🎨" 
        },
    ];

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            <Navbar />
            
            {/* Hero Section */}
            <section className="relative text-center py-20 sm:py-32 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-grid-slate-800/20 [mask-image:linear-gradient(to_bottom,white_5%,transparent_80%)]"></div>
                <div className="absolute inset-x-0 top-[-20rem] h-[50rem] bg-gradient-to-br from-[var(--accent-primary)]/10 via-[var(--bg-secondary)]/10 to-transparent blur-3xl -z-10"></div>
                
                <h1 className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text animate-gradient-text pb-4"
                    style={{ backgroundImage: 'linear-gradient(135deg, var(--accent-secondary), var(--accent-primary), var(--text-primary))' }}>
                    The Future of Business Communication is Here.
                </h1>
                <p className="max-w-2xl mx-auto mt-4 text-lg text-[var(--text-secondary)]">
                    Hunnyspace provides intelligent AI Chat Assistants that automate support, generate leads, and create premium customer experiences, 24/7.
                </p>
                <div 
                    className="mt-8 inline-block"
                >
                    <a href={agencyWaLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center text-lg font-bold py-4 px-10 rounded-full btn-premium-cta">
                        <ArrowRightIcon className="w-5 h-5 mr-3" />
                        <span>Get Your AI Assistant</span>
                    </a>
                    <p className="text-xs text-center text-[var(--text-secondary)] mt-2">
                        For Commercial Enquiries
                    </p>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 max-w-7xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-[var(--text-primary)]">Powerful Solutions for Modern Businesses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="glass-pane p-6 rounded-2xl transform hover:scale-105">
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-bold text-[var(--accent-secondary)] mb-2">{feature.title}</h3>
                            <p className="text-[var(--text-secondary)]">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>
            
            {/* Footer */}
            <footer className="text-center py-8 border-t" style={{ borderColor: 'var(--border-color)'}}>
                <p className="text-[var(--text-secondary)]/80">&copy; {new Date().getFullYear()} Hunnyspace. All rights reserved.</p>
                <p className="text-sm text-[var(--text-secondary)]/60 mt-1">Anuroop Batta, Founder</p>
            </footer>
        </div>
    );
};

export default Homepage;
