import { GoogleGenAI, Chat, GenerateContentResponse, Part, Type } from "@google/genai";
import { Business, ChatMessage, ChatSession } from '../types';
import { logUsage } from "./firebaseService";


/**
 * Creates a GoogleGenAI client instance.
 * It uses a business-specific API key if provided, otherwise falls back to the environment variable.
 * @param apiKey - An optional, business-specific Gemini API key.
 * @returns A GoogleGenAI instance.
 */
const createAiClient = (apiKey?: string): GoogleGenAI => {
    // Fix: Reverted to import.meta.env for client-side Vite environment variables.
    const keyToUse = apiKey || import.meta.env.VITE_API_KEY;
    if (!keyToUse) {
        // Fix: Updated error message to reflect the use of Vite environment variables.
        throw new Error("Gemini API key is not configured. Provide it for the business or set VITE_API_KEY in your environment variables.");
    }
    return new GoogleGenAI({ apiKey: keyToUse });
};


/**
 * Creates a new chat session with a system instruction tailored to the business.
 * @param business - The business object containing details for the system prompt.
 * @returns A Chat instance.
 */
export const createChatSession = (business: Business): Chat => {
  const aiClient = createAiClient(business.geminiApiKey);
  const systemInstruction = `You are ${business.characterName}, a friendly and professional AI assistant for ${business.businessName}, a ${business.businessCategory} located in ${business.city}. 
  Your goal is to assist customers, answer their questions, and generate leads.
  Business Information: ${business.businessInfo}.
  
  Key Instructions:
  1.  Always be polite, helpful, and maintain the persona of ${business.characterName}.
  2.  Use the provided business information to answer questions accurately.
  3.  If a user asks for contact information, provide the WhatsApp number: ${business.businessWaNumber}. You can provide it as a link: https://wa.me/${business.businessWaNumber}.
  4.  If a user asks about the website or location, provide these links if available: Website: ${business.websiteUrl || 'Not available'}, Google Business: ${business.googleBusinessUrl || 'Not available'}.
  5.  Encourage users to check out the product/service catalogue. If you mention products or services, you can trigger a special 'offer' keyword in your response which will show the user a list of available items.
  6.  Keep responses concise and easy to read. Use markdown for formatting like bolding key terms.
  7.  Do not make up information. If you don't know an answer, politely state that you don't have that information and suggest contacting the business directly via WhatsApp.
  8.  Do not reveal that you are a language model or AI. You are ${business.characterName}.
  9.  The currency for all pricing is ${business.currency}.
  10. When asked to perform an action you cannot do (e.g., book an appointment directly, process payments), guide the user to contact the business on WhatsApp to complete the action.`;

  const chat = aiClient.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
    }
  });
  return chat;
};

/**
 * Sends a message to the chat session and gets a response.
 * @param chat - The active Chat instance.
 * @param parts - The message parts (text and/or images) to send.
 * @param businessId - The ID of the business for usage logging.
 * @returns The AI's text response.
 */
export const getChatResponse = async (chat: Chat, parts: Part[], businessId: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message: parts });
    // Rough token calculation for internal usage metrics (1 token ~ 4 chars)
    const promptTokens = parts.reduce((acc, part) => acc + (part.text?.length || 0), 0) / 4;
    const responseTokens = (response.text?.length || 0) / 4;
    await logUsage(businessId, { geminiTokens: Math.round(promptTokens + responseTokens) });
    
    return response.text ?? "I'm sorry, I'm having trouble responding right now. Please try again in a moment.";
  } catch (error) {
    console.error("Error getting chat response from Gemini:", error);
    await logUsage(businessId, { geminiTokens: 100 }); // Log a fixed amount on error
    return "I'm sorry, an error occurred while connecting to the AI service. Please try again later.";
  }
};

/**
 * Generates an AI-powered summary of recent chat sessions.
 * @param sessions - An array of ChatSession objects.
 * @param business - The business object for API key and usage logging.
 * @returns A markdown-formatted summary string.
 */
export const generateChatSummary = async (sessions: ChatSession[], business: Business): Promise<string> => {
    if (sessions.length === 0) {
        return "No chat sessions found to analyze for the summary.";
    }
    const chatLogs = sessions.slice(0, 10).map(session => {
        const messages = session.messages.map(msg => `${msg.sender}: ${msg.text}`).join('\n');
        return `--- Session Start ---\n${messages}\n--- Session End ---`;
    }).join('\n\n');

    const prompt = `As a business intelligence analyst, review the following chat session logs for a business. Provide a concise summary with actionable insights. The summary should be in Markdown format.

    **Chat Logs:**
    ${chatLogs}

    **Analysis Required:**
    1.  **Overall Summary:** Briefly describe the general nature of the customer interactions.
    2.  **Key Topics:** Identify the top 3-5 most frequently discussed topics or questions (e.g., pricing, services, location, hours).
    3.  **Actionable Insights:** Suggest 2-3 concrete actions the business owner could take based on these conversations.
    4.  **Sentiment Analysis:** Briefly mention the overall customer sentiment (e.g., generally positive, neutral with specific concerns).

    Provide a professional, data-driven summary.`;

    try {
        const aiClient = createAiClient(business.geminiApiKey);
        const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const promptTokens = prompt.length / 4;
        const responseTokens = (response.text?.length || 0) / 4;
        await logUsage(business.businessId, { geminiTokens: Math.round(promptTokens + responseTokens) });
        
        return response.text ?? "Could not generate a summary at this time.";
    } catch (error) {
        console.error("Error generating chat summary:", error);
        await logUsage(business.businessId, { geminiTokens: 200 });
        return "An error occurred while generating the summary.";
    }
};

/**
 * Generates quick reply suggestions for a human agent.
 * @param messages - The recent messages in the conversation.
 * @param business - The business object for API key and usage logging.
 * @returns An array of string suggestions.
 */
export const getAgentSuggestions = async (messages: ChatMessage[], business: Business): Promise<string[]> => {
    const lastUserMessage = messages.filter(m => m.sender === 'user').pop();
    if (!lastUserMessage) {
        return [];
    }
    const conversationHistory = messages.slice(-5).map(m => `${m.sender}: ${m.text}`).join('\n');

    const prompt = `You are an assistant for a human customer support agent. Based on the recent conversation history, and specifically the last user message, provide three concise, helpful, and professional quick reply suggestions for the agent.

    **Recent Conversation:**
    ${conversationHistory}

    **Task:**
    Return a JSON array of three distinct string suggestions. For example: ["Yes, I can help with that.", "Let me check on that for you.", "Could you provide more details?"]`;

    try {
        const aiClient = createAiClient(business.geminiApiKey);
        const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING
                    }
                }
            }
        });
        const promptTokens = prompt.length / 4;
        const responseTokens = (response.text?.length || 0) / 4;
        await logUsage(business.businessId, { geminiTokens: Math.round(promptTokens + responseTokens) });
        
        const suggestions = JSON.parse(response.text ?? '[]');
        return Array.isArray(suggestions) ? suggestions.slice(0, 3) : [];

    } catch (error) {
        console.error("Error getting agent suggestions:", error);
        await logUsage(business.businessId, { geminiTokens: 150 });
        return ["How can I help?", "Let me check on that.", "Thanks for waiting."];
    }
};