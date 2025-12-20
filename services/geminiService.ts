
import { GoogleGenAI } from "@google/genai";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAIReply = async (
  prompt: string, 
  tone: string, 
  brandVoice: string, 
  blockedPhrases: string[]
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an AI assistant for an Instagram account.
      
      User Message: "${prompt}"
      Tone: ${tone}
      Brand Voice: ${brandVoice}
      Constraints: Do not use these phrases: ${blockedPhrases.join(', ')}
      
      Requirements:
      1. Sound human and conversational.
      2. Keep it under 50 words.
      3. No spammy sales language.
      4. Use a natural opening.
      
      Generate a professional DM reply.`,
    });
    
    // Access response.text property directly
    return response.text || "Sorry, I couldn't generate a reply at this time.";
  } catch (error) {
    console.error("AI Reply generation failed:", error);
    return "I'm having trouble thinking of a reply right now. Please try again.";
  }
};
