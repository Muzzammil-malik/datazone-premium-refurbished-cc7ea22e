import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export async function askGemini(prompt: string) {
  try {
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I am having trouble connecting to my brain right now. Please check if the API key is configured correctly.";
  }
}

export async function askGeminiStream(
  prompt: string,
  onChunk: (chunkText: string) => void
): Promise<string> {
  try {
    const result = await geminiModel.generateContentStream(prompt);
    let fullText = "";
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        fullText += chunkText;
        onChunk(chunkText);
      }
    }
    return fullText;
  } catch (error) {
    console.error("Gemini API Streaming Error:", error);
    const errorMessage =
      "Sorry, I am having trouble connecting to my brain right now. Please check if the API key is configured correctly.";
    onChunk(errorMessage);
    return errorMessage;
  }
}

