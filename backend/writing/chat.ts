import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = secret("GeminiApiKey");

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatRequest {
  message: string;
  context?: {
    currentStep: number;
    topic?: string;
    instructions?: string;
    wordCount?: number;
  };
  chatHistory: ChatMessage[];
}

interface ChatResponse {
  message: string;
  suggestions?: string[];
}

// AI chat assistant for helping users with their academic writing
export const chatWithAssistant = api<ChatRequest, ChatResponse>(
  { expose: true, method: "POST", path: "/writing/chat" },
  async (req) => {
    const genAI = new GoogleGenerativeAI(geminiApiKey());
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Build context for the AI assistant
    const contextInfo = req.context ? `
Current Step: ${req.context.currentStep}
Topic: ${req.context.topic || 'Not specified'}
Instructions: ${req.context.instructions || 'Not specified'}
Word Count: ${req.context.wordCount || 'Not specified'}
` : '';

    // Build chat history for context
    const chatHistoryText = req.chatHistory
      .slice(-5) // Keep last 5 messages for context
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    const systemPrompt = `You are an expert academic writing assistant helping students create high-quality academic papers. You are knowledgeable, helpful, and encouraging.

Current Context:
${contextInfo}

Recent Chat History:
${chatHistoryText}

Guidelines:
1. Provide specific, actionable advice for academic writing
2. Help with topic selection, research strategies, citation styles, and paper structure
3. Be encouraging and supportive
4. Keep responses concise but informative (2-3 sentences max)
5. Offer practical suggestions when appropriate
6. If asked about topics outside academic writing, politely redirect to writing-related help

User's question: ${req.message}

Respond helpfully and concisely:`;

    try {
      const result = await model.generateContent(systemPrompt);
      const response = result.response.text();

      // Generate contextual suggestions based on current step
      const suggestions = generateSuggestions(req.context?.currentStep || 1, req.context);

      return {
        message: response,
        suggestions
      };
    } catch (error) {
      console.error('Chat error:', error);
      return {
        message: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        suggestions: generateSuggestions(req.context?.currentStep || 1, req.context)
      };
    }
  }
);

function generateSuggestions(currentStep: number, context?: any): string[] {
  switch (currentStep) {
    case 1:
      return [
        "Help me choose a research topic",
        "What makes a good academic title?",
        "How specific should my topic be?"
      ];
    case 2:
      return [
        "What citation style should I use?",
        "How do I write clear instructions?",
        "What academic level should I specify?"
      ];
    case 3:
      return [
        "How many words for my paper type?",
        "What affects reading time?",
        "Tips for paper length planning"
      ];
    case 4:
      return [
        "What reference files help most?",
        "How to use uploaded documents?",
        "Best practices for sources"
      ];
    default:
      return [
        "Help with academic writing",
        "Citation and formatting tips",
        "Research strategies"
      ];
  }
}
