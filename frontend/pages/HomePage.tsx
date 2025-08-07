import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import WritingForm, { WritingFormData } from '../components/WritingForm';
import ProgressIndicator from '../components/ProgressIndicator';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';

const steps = [
  {
    id: 'input',
    title: 'Input',
    description: 'Provide requirements'
  },
  {
    id: 'generate',
    title: 'Generate',
    description: 'AI creates content'
  },
  {
    id: 'humanize',
    title: 'Humanize',
    description: 'Natural writing style'
  },
  {
    id: 'check',
    title: 'Verify',
    description: 'Quality assurance'
  },
  {
    id: 'complete',
    title: 'Complete',
    description: 'Ready for export'
  }
];

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState('input');
  const navigate = useNavigate();
  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: async (data: WritingFormData) => {
      setCurrentStep('generate');
      
      // Generate content
      const contentResponse = await backend.writing.generateContent(data);
      
      setCurrentStep('humanize');
      // Simulate humanization step (already done in generate)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setCurrentStep('check');
      // Check content quality
      const checkResponse = await backend.writing.checkContent({
        content: contentResponse.humanizedContent
      });
      
      setCurrentStep('complete');
      
      return {
        ...contentResponse,
        qualityMetrics: checkResponse
      };
    },
    onSuccess: (data) => {
      // Store results in sessionStorage for the results page
      sessionStorage.setItem('generatedContent', JSON.stringify(data));
      sessionStorage.setItem('originalFormData', JSON.stringify(data));
      
      toast({
        title: "Paper generated successfully!",
        description: "Your academic paper has been created and verified.",
      });
      
      // Navigate to results page after a brief delay
      setTimeout(() => {
        navigate('/results');
      }, 1000);
    },
    onError: (error) => {
      console.error('Generation error:', error);
      setCurrentStep('input');
      toast({
        title: "Generation failed",
        description: "Failed to generate your paper. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleFormSubmit = (data: WritingFormData) => {
    generateMutation.mutate(data);
  };

  return (
    <div className="space-y-8">
      {generateMutation.isPending && (
        <ProgressIndicator currentStep={currentStep} steps={steps} />
      )}
      
      <WritingForm 
        onSubmit={handleFormSubmit} 
        isLoading={generateMutation.isPending}
      />
      
      {generateMutation.isPending && (
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
            {currentStep === 'generate' && 'Generating original academic content...'}
            {currentStep === 'humanize' && 'Humanizing writing style...'}
            {currentStep === 'check' && 'Verifying quality and originality...'}
            {currentStep === 'complete' && 'Finalizing your paper...'}
          </div>
        </div>
      )}
    </div>
  );
}
