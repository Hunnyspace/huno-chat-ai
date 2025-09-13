import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Chat, Part } from '@google/genai';
import { Business, ChatMessage, Product } from '../types';
import { getBusinessById, logChatMessage, listenToLiveChat } from '../services/firebaseService';
import { createChatSession, getChatResponse } from '../services/geminiService';
import { AGENCY_WHATSAPP_NUMBER, AGENCY_WHATSAPP_PREFILL_MESSAGE } from '../constants';
import ChatMessageBubble from './ChatMessage';
import PrivacyDisclaimer from './PrivacyDisclaimer';
import ProductCatalogueModal from './ProductCatalogueModal';
import IceBreakers from './IceBreakers';
import { SendIcon } from './icons/SendIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { AttachmentIcon } from './icons/AttachmentIcon';
import { SpeakerWaveIcon } from './icons/SpeakerWaveIcon';
import { SpeakerXMarkIcon } from './icons/SpeakerXMarkIcon';
import { XMarkIcon } from './icons/XMarkIcon';
import { StopCircleIcon } from './icons/StopCircleIcon';
import { WebsiteIcon } from './icons/WebsiteIcon';
import { CatalogueIcon } from './icons/CatalogueIcon';
import { LocationIcon } from './icons/LocationIcon';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import AnnouncementBanner from './AnnouncementBanner';


interface ChatAssistantProps {
  businessId: string;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ businessId }) => {
  const SpeechRecognition = typeof window !== 'undefined' && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [agentJoined, setAgentJoined] = useState(false);
  const chatSession = useRef<Chat | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef<string>(sessionStorage.getItem(`sessionId_${businessId}`) || crypto.randomUUID());

  useEffect(() => {
    sessionStorage.setItem(`sessionId_${businessId}`, sessionId.current);
  }, [businessId]);
  
  const [isCatalogueOpen, setIsCatalogueOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<{ data: string; mimeType: string; name: string } | null>(null);
  const [isTtsEnabled, setIsTtsEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [selectedGender, setSelectedGender] = useState('female');
  const recognitionRef = useRef<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isChatHistoryLoaded, setIsChatHistoryLoaded] = useState(false);
  const textBeforeRecordingRef = useRef('');
  
  const [offerProducts, setOfferProducts] = useState<Product[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<Product | null>(null);


  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const data = await getBusinessById(businessId);
        if (data) {
          setBusiness(data);
          document.title = data.businessName;
          const metaTags = [
            { property: 'og:title', content: data.businessName },
            { property: 'og:description', content: `${data.businessCategory} | Powered by Hunnyspace` },
            { property: 'og:image', content: data.shareImageUrl },
          ];
          metaTags.forEach(tagInfo => {
            let metaTag = document.querySelector(`meta[property='${tagInfo.property}']`);
            if (!metaTag) {
              metaTag = document.createElement('meta');
              metaTag.setAttribute('property', tagInfo.property);
              document.head.appendChild(metaTag);
            }
            metaTag.setAttribute('content', tagInfo.content);
          });
          
          chatSession.current = createChatSession(data);
        } else {
          setError('Business not found. Please check the ID.');
        }
      } catch (err) {
        console.error("Failed to load business info:", err)
        setError('Failed to load business information. API keys may be missing.');
      } finally {
        setLoading(false);
      }
    };
    fetchBusinessData();
  }, [businessId]);

  useEffect(() => {
    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    if (loading || !business) return;

    const unsubscribe = listenToLiveChat(businessId, sessionId.current, (liveMessages, liveAgentJoined) => {
        setMessages(liveMessages);
        setAgentJoined(liveAgentJoined);
        if (!isChatHistoryLoaded) {
            setIsChatHistoryLoaded(true);
        }
    });

    return () => unsubscribe();
  }, [loading, business, businessId, isChatHistoryLoaded]);
  
  const speak = useCallback((text: string) => {
    if (!isTtsEnabled || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const languageVoices = voices.filter(v => v.lang.startsWith(selectedLanguage.split('-')[0]));
    const genderVoices = languageVoices.filter(v => v.name.toLowerCase().includes(selectedGender));
    const voiceToUse = genderVoices[0] || languageVoices[0] || voices[0];
    if (voiceToUse) utterance.voice = voiceToUse;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [isTtsEnabled, voices, selectedLanguage, selectedGender]);

  useEffect(() => {
    if (isChatHistoryLoaded && messages.length === 0 && business && chatSession.current && !agentJoined) {
        const getInitialAiResponse = async () => {
            setIsTyping(true);
            const aiResponseText = await getChatResponse(chatSession.current!, [{text: 'Hello'}], businessId);
            const newAiMessage: ChatMessage = { id: crypto.randomUUID(), text: aiResponseText, sender: 'ai' };
            await logChatMessage(businessId, sessionId.current, { text: newAiMessage.text, sender: newAiMessage.sender });
            setMessages([newAiMessage]);
            setIsTyping(false);
            speak(aiResponseText);
        };
        getInitialAiResponse();
    }
  }, [isChatHistoryLoaded, messages.length, business, agentJoined, businessId, speak]);
  
   useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [messages, isTyping, offerProducts]);


  const handleSend = useCallback(async (prompt?: string) => {
    const textToSend = prompt || userInput;
    if (!textToSend.trim() && !uploadedImage) return;

    const newUserMessage: ChatMessage = {
      id: crypto.randomUUID(),
      text: textToSend,
      sender: 'user',
      imageUrl: uploadedImage ? uploadedImage.data : undefined,
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    
    setIsTyping(true);
    setUserInput('');
    setUploadedImage(null);
    setOfferProducts([]);
    setSelectedOffer(null);

    await logChatMessage(businessId, sessionId.current, { text: newUserMessage.text, sender: 'user', imageUrl: newUserMessage.imageUrl });
    
    if (agentJoined) {
        setIsTyping(false);
        return;
    }

    if (chatSession.current) {
        const parts: Part[] = [{ text: textToSend }];
        if (uploadedImage) {
            parts.unshift({ inlineData: { data: uploadedImage.data.split(',')[1], mimeType: uploadedImage.mimeType } });
        }
      
        const aiResponseText = await getChatResponse(chatSession.current, parts, businessId);
      
        if (aiResponseText.toLowerCase().includes('offer')) {
          const validOffers = business?.products.filter(p => p.offer && new Date(p.offer.expiry) > new Date()) || [];
          setOfferProducts(validOffers);
        }

        speak(aiResponseText);
        await logChatMessage(businessId, sessionId.current, { text: aiResponseText, sender: 'ai' });
    }
    
    setIsTyping(false);

  }, [userInput, businessId, agentJoined, uploadedImage, speak, business]);

  const handleMicClick = () => {
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      textBeforeRecordingRef.current = userInput;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = selectedLanguage;
      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            textBeforeRecordingRef.current += event.results[i][0].transcript + ' ';
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setUserInput(textBeforeRecordingRef.current + interimTranscript);
      };
      recognitionRef.current.onend = () => setIsRecording(false);
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage({
          data: reader.result as string,
          mimeType: file.type,
          name: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  };
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Loading Business...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen bg-red-900 text-white p-4 text-center">{error}</div>;
  }
  
  if (!business) return null;

  const handleOfferWhatsAppClick = () => {
      if (!selectedOffer) return;
      const message = `Hi, I'm interested in the offer for '${selectedOffer.name}'.`;
      const waLink = `https://wa.me/${business.businessWaNumber}?text=${encodeURIComponent(message)}`;
      window.open(waLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <div className="flex flex-col h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        {business.announcementText && <AnnouncementBanner text={business.announcementText} />}
        {/* Header */}
        <header className="p-4 flex items-center justify-between glass-pane z-10" style={{borderBottom: '1px solid var(--border-color)'}}>
          <div className="flex items-center space-x-3">
              <img src={business.profileImageUrl} alt={business.businessName} className="w-12 h-12 rounded-full object-cover border-2 border-[var(--accent-primary)]/50" />
              <div>
                  <h1 className="font-bold text-lg text-white">{business.businessName}</h1>
                  <p className="text-xs text-[var(--text-secondary)]">
                      {business.characterName} &bull; {business.businessCategory}
                  </p>
              </div>
          </div>
          <div className="flex items-center space-x-2">
              {business.websiteUrl && (
                  <a href={business.websiteUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors" title="Visit Website">
                      <WebsiteIcon className="w-5 h-5 text-[var(--text-secondary)]" />
                  </a>
              )}
              {business.googleBusinessUrl && (
                  <a href={business.googleBusinessUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors" title="View on Google">
                      <LocationIcon className="w-5 h-5 text-[var(--text-secondary)]" />
                  </a>
              )}
              <button onClick={() => setIsCatalogueOpen(true)} className="p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors" title="View Catalogue">
                  <CatalogueIcon className="w-5 h-5 text-[var(--text-secondary)]" />
              </button>
              <button onClick={() => {
                  window.speechSynthesis.cancel();
                  setIsTtsEnabled(!isTtsEnabled)
              }} className="p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors" title={isTtsEnabled ? "Disable Text-to-Speech" : "Enable Text-to-Speech"}>
                  {isTtsEnabled ? <SpeakerWaveIcon className="w-5 h-5 text-[var(--accent-primary)]" /> : <SpeakerXMarkIcon className="w-5 h-5 text-[var(--text-secondary)]" />}
              </button>
          </div>
        </header>

        {/* Chat Area */}
        <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <ChatMessageBubble key={msg.id || index} message={msg} />
          ))}
          {isTyping && (
             <div className="flex justify-start">
              <div className="p-3 rounded-lg rounded-bl-none max-w-sm" style={{backgroundColor: 'var(--bg-secondary)'}}>
                  <div className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></span>
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></span>
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></span>
                  </div>
              </div>
            </div>
          )}
          {messages.length === 0 && !isTyping && (
            <IceBreakers onPromptClick={(prompt) => handleSend(prompt)} />
          )}
        </main>
        
        {/* Offers Carousel */}
        {offerProducts.length > 0 && (
          <section className="p-4 pt-0">
            <h3 className="text-sm font-bold text-[var(--accent-secondary)] mb-2">Special Offers Just For You!</h3>
            <div className="flex space-x-3 overflow-x-auto pb-3">
              {offerProducts.map(product => (
                <button key={product.id} onClick={() => setSelectedOffer(product)}
                  className={`flex-shrink-0 w-48 text-left rounded-lg overflow-hidden border-2 transition-all duration-200 ${selectedOffer?.id === product.id ? 'border-[var(--accent-primary)] scale-105' : 'border-transparent'}`}
                >
                  <img src={product.imageUrl} alt={product.name} className="w-full h-20 object-cover" />
                  <div className="p-2 bg-[var(--bg-secondary)]">
                    <p className="text-xs font-bold truncate text-white">{product.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      Now: {business.currency === 'INR' ? '₹' : '$'}{product.offer?.newPrice} <span className="line-through">{business.currency === 'INR' ? '₹' : '$'}{product.price}</span>
                    </p>
                  </div>
                </button>
              ))}
            </div>
            {selectedOffer && (
                 <button onClick={handleOfferWhatsAppClick} className="w-full mt-2 flex items-center justify-center bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-500 transition-all duration-200">
                    <WhatsAppIcon className="w-5 h-5 mr-2" />
                    Get Details for "{selectedOffer.name}"
                </button>
            )}
          </section>
        )}

        {/* Input Area */}
        <footer className="p-4 pt-2">
           <PrivacyDisclaimer />
           {uploadedImage && (
              <div className="my-2 p-2 rounded-lg flex justify-between items-center" style={{backgroundColor: 'var(--bg-secondary)'}}>
                  <div className="flex items-center space-x-2 overflow-hidden">
                      <img src={uploadedImage.data} alt="preview" className="w-10 h-10 rounded-md object-cover" />
                      <p className="text-xs text-[var(--text-secondary)] truncate">{uploadedImage.name}</p>
                  </div>
                  <button onClick={() => setUploadedImage(null)} className="p-1 rounded-full hover:bg-gray-700">
                      <XMarkIcon className="w-4 h-4" />
                  </button>
              </div>
           )}
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center space-x-2">
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 rounded-full hover:bg-[var(--bg-secondary)] transition-colors" aria-label="Attach file">
                <AttachmentIcon className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>
            {SpeechRecognition && (
                 <button type="button" onClick={handleMicClick} className={`p-3 rounded-full transition-colors ${isRecording ? 'bg-red-500/20 text-red-400' : 'hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]'}`} aria-label={isRecording ? 'Stop recording' : 'Start recording'}>
                    {isRecording ? <StopCircleIcon className="w-5 h-5" /> : <MicrophoneIcon className="w-5 h-5" />}
                 </button>
            )}
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={agentJoined ? "An agent has joined. Type here..." : "Type your message..."}
              className="flex-1 input-field rounded-full px-5 py-3"
              disabled={isTyping}
            />
            <button type="submit" disabled={isTyping || (!userInput.trim() && !uploadedImage)} className="p-3 rounded-full btn-primary disabled:opacity-50 disabled:scale-100" aria-label="Send message">
              <SendIcon />
            </button>
          </form>
          <div className="text-center text-xs mt-3">
              <span className="text-[var(--text-secondary)]">Powered by </span>
              <a href={`https://wa.me/${AGENCY_WHATSAPP_NUMBER}?text=${encodeURIComponent(AGENCY_WHATSAPP_PREFILL_MESSAGE)}`} target="_blank" rel="noopener noreferrer" className="font-bold text-transparent bg-clip-text" style={{backgroundImage: 'var(--accent-gradient)'}}>Hunnyspace</a>
          </div>
        </footer>
      </div>

      {isCatalogueOpen && (
        <ProductCatalogueModal business={business} onClose={() => setIsCatalogueOpen(false)} />
      )}
    </>
  );
};

export default ChatAssistant;