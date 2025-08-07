import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import ContentPreview from '../components/ContentPreview';
import ExportOptions from '../components/ExportOptions';

interface GeneratedContent {
  content: string;
  humanizedContent: string;
  wordCount: number;
  estimatedReadingTime: number;
  qualityMetrics: {
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

export default function ResultsPage() {
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [originalFormData, setOriginalFormData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve data from sessionStorage
    const contentData = sessionStorage.getItem('generatedContent');
    const formData = sessionStorage.getItem('originalFormData');
    
    if (contentData) {
      setGeneratedContent(JSON.parse(contentData));
    }
    
    if (formData) {
      setOriginalFormData(JSON.parse(formData));
    }
    
    // If no data found, redirect to home
    if (!contentData) {
      navigate('/');
    }
  }, [navigate]);

  const handleBackToHome = () => {
    // Clear session storage
    sessionStorage.removeItem('generatedContent');
    sessionStorage.removeItem('originalFormData');
    navigate('/');
  };

  if (!generatedContent) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Academic Paper</h1>
          <p className="text-gray-600 mt-1">
            Generated content ready for review and export
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={handleBackToHome}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            New Paper
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Regenerate
          </Button>
        </div>
      </div>

      {/* Content Preview */}
      <ContentPreview
        content={generatedContent.humanizedContent}
        wordCount={generatedContent.wordCount}
        estimatedReadingTime={generatedContent.estimatedReadingTime}
        qualityMetrics={generatedContent.qualityMetrics}
      />

      {/* Export Options */}
      <ExportOptions
        content={generatedContent.humanizedContent}
        title={originalFormData?.topic || 'Academic Paper'}
      />
    </div>
  );
}
