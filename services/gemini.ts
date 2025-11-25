import { GoogleGenAI } from "@google/genai";

export const rewriteText = async (currentText: string, style: 'professional' | 'creative' | 'shorter' = 'professional'): Promise<string> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.warn("API Key not found. Returning original text.");
    return currentText;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `Rewrite the following text to be more ${style}, suitable for a UI/UX designer's portfolio website. Keep it concise. Text to rewrite: "${currentText}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || currentText;
  } catch (error) {
    console.error("Gemini rewrite failed:", error);
    return currentText;
  }
};