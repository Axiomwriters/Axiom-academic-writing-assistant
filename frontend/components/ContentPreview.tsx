import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, BarChart3, Shield, Brain, Award } from 'lucide-react';

interface ContentPreviewProps {
  content: string;
  wordCount: number;
  estimatedReadingTime: number;
  qualityMetrics?: {
    plagiarismScore: number;
    aiDetectionScore: number;
    readabilityScore: number;
    qualityIndicators: {
      originalityLevel: "excellent" | "good" | "fair" | "poor";
      humanLikeScore: "excellent" | "good" | "fair" | "poor";
      academicQuality: "excellent" | "good" | "fair" | "poor";
    };
  };
}

export default function ContentPreview({ 
  content, 
  wordCount, 
  estimatedReadingTime, 
  qualityMetrics 
}: ContentPreviewProps) {
  const getScoreColor = (score: number, reverse = false) => {
    if (reverse) {
      if (score < 10) return 'text-green-600';
      if (score < 25) return 'text-yellow-600';
      return 'text-red-600';
    } else {
      if (score > 80) return 'text-green-600';
      if (score > 60) return 'text-yellow-600';
      return 'text-red-600';
    }
  };

  const getQualityBadgeVariant = (level: string) => {
    switch (level) {
      case 'excellent': return 'default';
      case 'good': return 'secondary';
      case 'fair': return 'outline';
      case 'poor': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Quality Metrics */}
      {qualityMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">Originality</span>
                </div>
                <Badge variant={getQualityBadgeVariant(qualityMetrics.qualityIndicators.originalityLevel)}>
                  {qualityMetrics.qualityIndicators.originalityLevel}
                </Badge>
              </div>
              <p className={`text-2xl font-bold mt-2 ${getScoreColor(qualityMetrics.plagiarismScore, true)}`}>
                {(100 - qualityMetrics.plagiarismScore).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-600">Plagiarism-free</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">Human-like</span>
                </div>
                <Badge variant={getQualityBadgeVariant(qualityMetrics.qualityIndicators.humanLikeScore)}>
                  {qualityMetrics.qualityIndicators.humanLikeScore}
                </Badge>
              </div>
              <p className={`text-2xl font-bold mt-2 ${getScoreColor(qualityMetrics.aiDetectionScore, true)}`}>
                {(100 - qualityMetrics.aiDetectionScore).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-600">Natural writing</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium">Quality</span>
                </div>
                <Badge variant={getQualityBadgeVariant(qualityMetrics.qualityIndicators.academicQuality)}>
                  {qualityMetrics.qualityIndicators.academicQuality}
                </Badge>
              </div>
              <p className={`text-2xl font-bold mt-2 ${getScoreColor(qualityMetrics.readabilityScore)}`}>
                {qualityMetrics.readabilityScore.toFixed(1)}
              </p>
              <p className="text-xs text-gray-600">Readability score</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Content Stats */}
      <div className="flex items-center space-x-6 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4" />
          <span>{wordCount.toLocaleString()} words</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4" />
          <span>{estimatedReadingTime} min read</span>
        </div>
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-4 w-4" />
          <span>Academic level</span>
        </div>
      </div>

      {/* Content Preview */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Generated Content Preview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {content.length > 1000 ? `${content.substring(0, 1000)}...` : content}
            </div>
            {content.length > 1000 && (
              <p className="text-sm text-gray-500 mt-4 italic">
                Preview showing first 1000 characters. Full content will be available in the exported document.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
