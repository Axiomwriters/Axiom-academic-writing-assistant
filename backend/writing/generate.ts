import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = secret("GeminiApiKey");

interface GenerateContentRequest {
  topic: string;
  instructions: string;
  wordCount: number;
  referenceFileUrl?: string;
}

interface GenerateContentResponse {
  content: string;
  humanizedContent: string;
  wordCount: number;
  estimatedReadingTime: number;
}

// Generates academic content using Gemini AI
export const generateContent = api<GenerateContentRequest, GenerateContentResponse>(
  { expose: true, method: "POST", path: "/writing/generate" },
  async (req) => {
    const genAI = new GoogleGenerativeAI(geminiApiKey());
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create structured academic writing prompt
    const academicPrompt = `
You are an expert academic writer. Create a well-structured academic paper on the following topic:

Topic: ${req.topic}
Instructions: ${req.instructions}
Target Word Count: ${req.wordCount} words
${req.referenceFileUrl ? `Reference Document: ${req.referenceFileUrl}` : ''}

Requirements:
1. Include a compelling introduction with thesis statement
2. Develop 3-5 well-organized body paragraphs with clear topic sentences
3. Provide a strong conclusion that synthesizes key points
4. Use formal academic language and proper transitions
5. Include relevant examples and analysis
6. Maintain scholarly tone throughout
7. Ensure content is original and well-researched

Structure the response with clear headings:
- Introduction
- Body paragraphs (with subheadings as appropriate)
- Conclusion

Write approximately ${req.wordCount} words.
`;

    // Generate initial content
    const result = await model.generateContent(academicPrompt);
    const initialContent = result.response.text();

    // Humanize the content with a second API call
    const humanizePrompt = `
Take the following academic text and rewrite it to sound more natural and human-like while maintaining academic quality and structure. Make it sound like it was written by a university student who is knowledgeable but not overly formal or robotic.

Key adjustments:
1. Use more natural sentence flow and varied sentence lengths
2. Include occasional personal insights or observations
3. Make transitions more conversational but still academic
4. Reduce overly complex vocabulary where simpler words work
5. Add subtle personality while keeping it professional
6. Maintain all factual content and academic structure

Original text:
${initialContent}

Rewrite this to sound more human and natural while preserving academic integrity:
`;

    const humanizeResult = await model.generateContent(humanizePrompt);
    const humanizedContent = humanizeResult.response.text();

    // Calculate metrics
    const wordCount = humanizedContent.split(/\s+/).length;
    const estimatedReadingTime = Math.ceil(wordCount / 200); // Average reading speed

    return {
      content: initialContent,
      humanizedContent,
      wordCount,
      estimatedReadingTime
    };
  }
);
