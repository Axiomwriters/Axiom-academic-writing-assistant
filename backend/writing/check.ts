import { api } from "encore.dev/api";

interface CheckContentRequest {
  content: string;
}

interface CheckContentResponse {
  plagiarismScore: number;
  aiDetectionScore: number;
  readabilityScore: number;
  qualityIndicators: {
    originalityLevel: "excellent" | "good" | "fair" | "poor";
    humanLikeScore: "excellent" | "good" | "fair" | "poor";
    academicQuality: "excellent" | "good" | "fair" | "poor";
  };
}

// Checks content for plagiarism, AI detection, and quality metrics
export const checkContent = api<CheckContentRequest, CheckContentResponse>(
  { expose: true, method: "POST", path: "/writing/check" },
  async (req) => {
    // Simulate content analysis
    // In a real implementation, integrate with:
    // - Copyleaks or Turnitin for plagiarism detection
    // - Originality.AI or GPTZero for AI detection
    // - Custom readability analysis
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate realistic mock scores
    const plagiarismScore = Math.random() * 15; // 0-15% plagiarism
    const aiDetectionScore = Math.random() * 25; // 0-25% AI detection
    const readabilityScore = 75 + Math.random() * 20; // 75-95 readability
    
    const getQualityLevel = (score: number, reverse = false): "excellent" | "good" | "fair" | "poor" => {
      if (reverse) {
        if (score < 10) return "excellent";
        if (score < 20) return "good";
        if (score < 35) return "fair";
        return "poor";
      } else {
        if (score > 85) return "excellent";
        if (score > 70) return "good";
        if (score > 55) return "fair";
        return "poor";
      }
    };
    
    return {
      plagiarismScore: Math.round(plagiarismScore * 10) / 10,
      aiDetectionScore: Math.round(aiDetectionScore * 10) / 10,
      readabilityScore: Math.round(readabilityScore * 10) / 10,
      qualityIndicators: {
        originalityLevel: getQualityLevel(plagiarismScore, true),
        humanLikeScore: getQualityLevel(aiDetectionScore, true),
        academicQuality: getQualityLevel(readabilityScore)
      }
    };
  }
);
