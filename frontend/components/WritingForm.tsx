import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, Sparkles, Clock, Target } from 'lucide-react';
import FileUpload from './FileUpload';

interface WritingFormProps {
  onSubmit: (data: WritingFormData) => void;
  isLoading: boolean;
}

export interface WritingFormData {
  topic: string;
  instructions: string;
  wordCount: number;
  referenceFileUrl?: string;
}

export default function WritingForm({ onSubmit, isLoading }: WritingFormProps) {
  const [formData, setFormData] = useState<WritingFormData>({
    topic: '',
    instructions: '',
    wordCount: 1000,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleFileUpload = (fileUrl: string) => {
    setFormData(prev => ({ ...prev, referenceFileUrl: fileUrl }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Sparkles className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Create Your Academic Paper
        </CardTitle>
        <CardDescription className="text-gray-600">
          Provide your requirements and let AI craft a professional academic paper for you
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic" className="text-sm font-medium text-gray-700">
              Academic Topic or Title
            </Label>
            <Input
              id="topic"
              placeholder="e.g., The Impact of Climate Change on Global Economics"
              value={formData.topic}
              onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
              required
              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions" className="text-sm font-medium text-gray-700">
              Writing Instructions & Requirements
            </Label>
            <Textarea
              id="instructions"
              placeholder="Provide specific instructions, requirements, citation style, key points to cover, etc."
              value={formData.instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
              rows={4}
              required
              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="wordCount" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Target Word Count
              </Label>
              <Select
                value={formData.wordCount.toString()}
                onValueChange={(value) => setFormData(prev => ({ ...prev, wordCount: parseInt(value) }))}
              >
                <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="500">500 words</SelectItem>
                  <SelectItem value="750">750 words</SelectItem>
                  <SelectItem value="1000">1,000 words</SelectItem>
                  <SelectItem value="1500">1,500 words</SelectItem>
                  <SelectItem value="2000">2,000 words</SelectItem>
                  <SelectItem value="2500">2,500 words</SelectItem>
                  <SelectItem value="3000">3,000 words</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Estimated Time
              </Label>
              <div className="h-10 px-3 py-2 border border-gray-200 rounded-md bg-gray-50 flex items-center text-sm text-gray-600">
                {Math.ceil(formData.wordCount / 200)} min read
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Reference Document (Optional)
            </Label>
            <FileUpload onFileUpload={handleFileUpload} />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isLoading || !formData.topic || !formData.instructions}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating Your Paper...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Generate Academic Paper
                </div>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
