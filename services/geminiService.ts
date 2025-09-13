// Fix: Update the import to use the correct '@google/genai' package.
import { GoogleGenAI, Chat, GenerateContentResponse, Part, Type } from "@google/genai";
import { Business, ChatMessage, ChatSession } from '../types';
import { logUsage } from "./firebaseService";

// Fix: Initialize GoogleGenAI with process.env.API_KEY as per the coding guidelines.
// The API key's availability is assumed to be handled by the execution environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to estimate token count
const estimateTokens = (text: string) => Math.ceil(text.length / 4);

export const createChatSession = (business: Business): Chat => {

  let productInfo = "This business does not have a product catalogue listed.";
  if (business.products && business.products.length > 0) {
    productInfo = `Here is the product catalogue. You can answer questions based on this. \n\n${business.products.map(p => {
      const offerString = p.offer ? ` Offer Price: ${p.offer.newPrice} (expires ${p.offer.expiry})` : '';
      return `- Product Name: ${p.name}\n  Type: ${p.type}\n  Description: ${p.description}\n  Price: ${p.price}${offerString}\n  Stock: ${p.type === 'product' ? p.stock : 'N/A'}`;
    }).join('\n\n')}`;
  }

  const systemInstruction = `You are ${business.characterName}, a warm, empathetic, and professional AI assistant for ${business.businessName}. Your primary role is to assist potential clients by providing helpful information and guiding them to connect with the business.

**Your Personality & Tone:**
- **Human-like & Concise:** Be friendly, approachable, and use a conversational tone. Keep your answers short, meaningful, and to the point. Avoid long paragraphs. If you need to convey a lot of information, break it into smaller, easy-to-digest messages.
- **Maintain Context:** Pay close attention to the flow of the conversation. Refer back to previous questions if it makes the chat feel more natural and continuous.
- **Empathetic & Professional:** Be empathetic to the user's needs (e.g., "I understand you're looking for information on colds..."). Be professional and clear in your explanations.
- **Vary Greetings:** Vary your initial greeting. Instead of always saying "Hello", try things like "Hi there!", "Welcome! How can I help?", or start directly with "I'm ${business.characterName}, the AI assistant for ${business.businessName}. What can I do for you today?".

**Your Core Task:**
1.  Carefully analyze the user's query.
2.  Answer the query using **only** the information provided in the "Business Information" and "Product Catalogue" sections below.
3.  **Do not invent any details, prices, or services.** This is extremely important.
4.  **Crucially, do not provide medical, legal, or financial advice.** If the query asks for advice (e.g., "What should I do for a cold?"), your response must explain what services ${business.businessName} offers for that condition based on your information, and then strongly recommend contacting the professional directly for a proper consultation.
5.  Seamlessly integrate a call to action in your response. Instead of just saying "contact them", try to phrase it naturally, like "For a personal consultation about your symptoms, the best step is to connect with Dr. Udbhavi directly."
6.  If a user asks about products or services, use the provided catalogue. Note the 'type' field to distinguish between a 'product' with stock and a 'service'. If they ask to buy something or inquire, guide them to use the "View Catalogue" button or connect via WhatsApp. Mention any special offers if they exist.
7.  If you absolutely cannot find any relevant information in your knowledge base to answer the user's question, politely state that you don't have the specific details and provide the business's contact information as the best source for an accurate answer.

**Business Information:**
---
${business.businessInfo}
---

**Product Catalogue:**
---
${productInfo}
---
`;

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction,
    },
  });
};

export const getChatResponse = async (chat: Chat, parts: Part[], businessId: string): Promise<string> => {
  try {
    const promptText = parts.find(p => p.text)?.text || '';
    const promptTokens = estimateTokens(promptText);

    // Fix: The `sendMessage` method expects a `SendMessageParameters` object, which has a `message` property.
    const result: GenerateContentResponse = await chat.sendMessage({ message: parts });
    const responseText = result.text ?? '';
    
    const responseTokens = estimateTokens(responseText);
    await logUsage(businessId, { geminiTokens: promptTokens + responseTokens });

    return responseText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm sorry, I'm having a bit of trouble connecting right now. Please try again in a moment.";
  }
};


export const generateChatSummary = async (sessions: ChatSession[], businessId: string): Promise<string> => {
  if (sessions.length === 0) {
    return "No chat data available to generate a summary.";
  }

  const recentSessions = sessions.slice(0, 10);
  
  const conversationHistory = recentSessions.map(session => 
    `Session ID: ${session.id}\n` +
    session.messages.map(msg => `${msg.sender}: ${msg.text}`).join('\n')
  ).join('\n\n---\n\n');

  const prompt = `
    As a business intelligence analyst, review the following chat session transcripts between an AI assistant and potential customers for a business. Provide a concise summary that will help the business owner understand customer interactions.

    **Chat Transcripts:**
    ${conversationHistory}

    **Analysis Task:**
    Based on the transcripts, generate a summary in Markdown format. The summary should include:
    1.  **Top 3 Most Common Topics:** What are the most frequent subjects customers are asking about? (e.g., specific services, pricing, business hours).
    2.  **Key Customer Interests:** Were there any specific products or services that generated significant interest?
    3.  **Actionable Insight:** Provide one concrete suggestion for the business owner based on these conversations. For example, "Consider creating a dedicated FAQ page for pricing, as it's a very common question."
  `;
  
  try {
      const promptTokens = estimateTokens(prompt);
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      const responseText = response.text ?? '';
      const responseTokens = estimateTokens(responseText);
      await logUsage(businessId, { geminiTokens: promptTokens + responseTokens });
      return responseText;
  } catch(e) {
      console.error(e);
      return "Could not generate summary due to an error."
  }
};

export const getAgentSuggestions = async (messages: ChatMessage[], businessId: string): Promise<string[]> => {
    if (messages.length === 0) return [];
    
    const recentHistory = messages.slice(-4).map(m => `${m.sender}: ${m.text}`).join('\n');
    const lastUserMessage = messages.filter(m => m.sender === 'user').pop()?.text;
    
    if (!lastUserMessage) return [];

    const prompt = `
        You are an AI assistant for a customer support agent. Based on the recent conversation history and specifically the last user message, generate 3 concise, helpful, and professional replies that the agent can use.

        **Conversation History:**
        ${recentHistory}

        **Last User Message:**
        "${lastUserMessage}"

        **Task:**
        Provide 3 short, distinct reply suggestions for the agent.
    `;

    try {
        const promptTokens = estimateTokens(prompt);
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING,
                            },
                        },
                    },
                },
            },
        });
        
        const jsonStr = (response.text ?? '').trim();
        const responseTokens = estimateTokens(jsonStr);
        await logUsage(businessId, { geminiTokens: promptTokens + responseTokens });

        const parsed = JSON.parse(jsonStr);
        return parsed.suggestions || [];
    } catch (e) {
        console.error("Error getting agent suggestions:", e);
        return [];
    }
};