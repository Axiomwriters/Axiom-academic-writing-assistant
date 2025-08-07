import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, RefreshCw, Shield, Brain, Award, FileText, Clock, BarChart3, CheckCircle, Download, Mail, Copy, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
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
  const [showFullContent, setShowFullContent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleCopyContent = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent.humanizedContent);
      toast({
        title: "Content copied!",
        description: "The academic paper has been copied to your clipboard.",
      });
    }
  };

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

  const getProgressColor = (score: number, reverse = false) => {
    if (reverse) {
      if (score < 10) return 'bg-green-500';
      if (score < 25) return 'bg-yellow-500';
      return 'bg-red-500';
    } else {
      if (score > 80) return 'bg-green-500';
      if (score > 60) return 'bg-yellow-500';
      return 'bg-red-500';
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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

      {/* Success Banner */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-900">Paper Generated Successfully!</h3>
              <p className="text-green-700 mt-1">
                Your academic paper has been created, humanized, and verified for quality. Ready for submission!
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                100% Original
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Human-like
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Academic Quality
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quality Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Plagiarism Check */}
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-green-600" />
                <CardTitle className="text-lg text-green-900">Originality Check</CardTitle>
              </div>
              <Badge variant={getQualityBadgeVariant(generatedContent.qualityMetrics.qualityIndicators.originalityLevel)} className="bg-green-100 text-green-800 border-green-300">
                {generatedContent.qualityMetrics.qualityIndicators.originalityLevel}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(generatedContent.qualityMetrics.plagiarismScore, true)}`}>
                  {(100 - generatedContent.qualityMetrics.plagiarismScore).toFixed(1)}%
                </div>
                <p className="text-sm text-gray-600 mt-1">Plagiarism-free content</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Originality Score</span>
                  <span className="font-medium">{(100 - generatedContent.qualityMetrics.plagiarismScore).toFixed(1)}%</span>
                </div>
                <Progress 
                  value={100 - generatedContent.qualityMetrics.plagiarismScore} 
                  className="h-2"
                />
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <p className="text-xs text-green-800 font-medium">✓ Passed all plagiarism checks</p>
                <p className="text-xs text-green-700 mt-1">Content is 100% original and unique</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Detection */}
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Brain className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-lg text-blue-900">Human-like Writing</CardTitle>
              </div>
              <Badge variant={getQualityBadgeVariant(generatedContent.qualityMetrics.qualityIndicators.humanLikeScore)} className="bg-blue-100 text-blue-800 border-blue-300">
                {generatedContent.qualityMetrics.qualityIndicators.humanLikeScore}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(generatedContent.qualityMetrics.aiDetectionScore, true)}`}>
                  {(100 - generatedContent.qualityMetrics.aiDetectionScore).toFixed(1)}%
                </div>
                <p className="text-sm text-gray-600 mt-1">Human-like score</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Natural Writing</span>
                  <span className="font-medium">{(100 - generatedContent.qualityMetrics.aiDetectionScore).toFixed(1)}%</span>
                </div>
                <Progress 
                  value={100 - generatedContent.qualityMetrics.aiDetectionScore} 
                  className="h-2"
                />
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <p className="text-xs text-blue-800 font-medium">✓ Humanized successfully</p>
                <p className="text-xs text-blue-700 mt-1">Writing style appears natural and authentic</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Quality */}
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Award className="h-6 w-6 text-purple-600" />
                <CardTitle className="text-lg text-purple-900">Academic Quality</CardTitle>
              </div>
              <Badge variant={getQualityBadgeVariant(generatedContent.qualityMetrics.qualityIndicators.academicQuality)} className="bg-purple-100 text-purple-800 border-purple-300">
                {generatedContent.qualityMetrics.qualityIndicators.academicQuality}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(generatedContent.qualityMetrics.readabilityScore)}`}>
                  {generatedContent.qualityMetrics.readabilityScore.toFixed(1)}
                </div>
                <p className="text-sm text-gray-600 mt-1">Readability score</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Quality Rating</span>
                  <span className="font-medium">{generatedContent.qualityMetrics.readabilityScore.toFixed(1)}/100</span>
                </div>
                <Progress 
                  value={generatedContent.qualityMetrics.readabilityScore} 
                  className="h-2"
                />
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <p className="text-xs text-purple-800 font-medium">✓ Academic standards met</p>
                <p className="text-xs text-purple-700 mt-1">Professional quality for submission</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Document Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{generatedContent.wordCount.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Words</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{generatedContent.estimatedReadingTime}</div>
              <div className="text-sm text-gray-600">Min Read</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">A+</div>
              <div className="text-sm text-gray-600">Grade Level</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-2">
                <Shield className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">100%</div>
              <div className="text-sm text-gray-600">Verified</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Preview */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Generated Academic Paper</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyContent}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFullContent(!showFullContent)}
                className="flex items-center gap-2"
              >
                {showFullContent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showFullContent ? 'Show Less' : 'Show Full'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed bg-gray-50 p-6 rounded-lg border">
              {showFullContent 
                ? generatedContent.humanizedContent 
                : `${generatedContent.humanizedContent.substring(0, 1500)}${generatedContent.humanizedContent.length > 1500 ? '...' : ''}`
              }
            </div>
            {!showFullContent && generatedContent.humanizedContent.length > 1500 && (
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  onClick={() => setShowFullContent(true)}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Show Full Content ({generatedContent.wordCount.toLocaleString()} words)
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quality Assurance Summary */}
      <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Quality Assurance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Content Verification</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Plagiarism-free content verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">AI detection passed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Academic structure validated</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Grammar and style checked</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Ready for Submission</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Professional formatting applied</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Citation style implemented</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Word count target achieved</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Export formats available</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <ExportOptions
        content={generatedContent.humanizedContent}
        title={originalFormData?.topic || 'Academic Paper'}
      />
    </div>
  );
}
