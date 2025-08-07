import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, Sparkles, Clock, Target, ArrowRight, ArrowLeft, CheckCircle, MessageCircle, X } from 'lucide-react';
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

const STEPS = [
  { id: 1, title: 'Topic', description: 'Define your academic topic' },
  { id: 2, title: 'Instructions', description: 'Provide writing requirements' },
  { id: 3, title: 'Configuration', description: 'Set word count and options' },
  { id: 4, title: 'Reference', description: 'Upload supporting documents' },
];

export default function WritingForm({ onSubmit, isLoading }: WritingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showChatBot, setShowChatBot] = useState(false);
  const [formData, setFormData] = useState<WritingFormData>({
    topic: '',
    instructions: '',
    wordCount: 1000,
  });

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleFileUpload = (fileUrl: string) => {
    setFormData(prev => ({ ...prev, referenceFileUrl: fileUrl }));
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.topic.trim().length > 0;
      case 2:
        return formData.instructions.trim().length > 0;
      case 3:
        return formData.wordCount > 0;
      case 4:
        return true; // Optional step
      default:
        return false;
    }
  };

  const canProceed = isStepValid(currentStep);

  const getStepSuggestions = (step: number) => {
    switch (step) {
      case 1:
        return [
          "Need help choosing a topic? I can suggest relevant academic topics based on your field of study.",
          "Make sure your topic is specific enough to be manageable but broad enough to find sufficient research.",
          "Consider current trends and debates in your field for a more engaging paper."
        ];
      case 2:
        return [
          "Include your preferred citation style (APA, MLA, Chicago, etc.) in the instructions.",
          "Specify your academic level (undergraduate, graduate, PhD) for appropriate complexity.",
          "Mention any specific sources or perspectives you want included or avoided."
        ];
      case 3:
        return [
          "Consider your assignment requirements when choosing word count.",
          "Longer papers allow for more detailed analysis and multiple perspectives.",
          "Remember that quality is more important than quantity - choose what fits your needs."
        ];
      case 4:
        return [
          "Reference documents help me understand your preferred style and approach.",
          "Upload relevant research papers, course materials, or assignment guidelines.",
          "This step is optional but can significantly improve the quality of your paper."
        ];
      default:
        return ["I'm here to help you create the best academic paper possible!"];
    }
  };

  return (
    <div className="relative">
      <Card className="w-full max-w-3xl mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-sm">
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
            Follow the steps below to generate your professional academic paper
          </CardDescription>
        </CardHeader>

        {/* Progress Indicator */}
        <div className="px-4 sm:px-6 mb-6">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center w-full">
                  <div className={`
                    flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-300
                    ${currentStep > step.id 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : currentStep === step.id
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                    }
                  `}>
                    {currentStep > step.id ? (
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <span className="text-xs sm:text-sm font-medium">{step.id}</span>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={`text-xs font-medium ${
                      currentStep === step.id ? 'text-blue-600' : 
                      currentStep > step.id ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 hidden sm:block">
                      {step.description}
                    </p>
                  </div>
                </div>
                
                {index < STEPS.length - 1 && (
                  <div className={`
                    flex-1 h-0.5 mx-2 sm:mx-4 transition-all duration-300
                    ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'}
                  `} />
                )}
              </div>
            ))}
          </div>
        </div>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Topic */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Academic Topic & Title</h3>
                  <p className="text-sm text-gray-600">What would you like to write about?</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="topic" className="text-sm font-medium text-gray-700">
                    Academic Topic or Title
                  </Label>
                  <Input
                    id="topic"
                    placeholder="e.g., The Impact of Climate Change on Global Economics"
                    value={formData.topic}
                    onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-base py-3"
                  />
                  <p className="text-xs text-gray-500">
                    Be specific and clear about your research topic or paper title
                  </p>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  {currentStep < STEPS.length ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={!canProceed}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center gap-2"
                    >
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isLoading || !formData.topic || !formData.instructions}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:opacity-50"
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
                  )}
                </div>

                {/* AI Chat Assistant Button */}
                <div className="flex justify-center pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowChatBot(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 hover:from-purple-100 hover:to-blue-100 text-purple-700 hover:text-purple-800"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Need Help? Ask AI Assistant
                  </Button>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">💡 Topic Tips:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Be specific rather than too broad</li>
                    <li>• Include key concepts or themes</li>
                    <li>• Consider your target audience</li>
                    <li>• Make it engaging and researchable</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Step 2: Instructions */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Writing Instructions</h3>
                  <p className="text-sm text-gray-600">Provide detailed requirements for your paper</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instructions" className="text-sm font-medium text-gray-700">
                    Writing Instructions & Requirements
                  </Label>
                  <Textarea
                    id="instructions"
                    placeholder="Provide specific instructions such as:
• Citation style (APA, MLA, Chicago, etc.)
• Key points or arguments to cover
• Academic level (undergraduate, graduate, etc.)
• Specific requirements or guidelines
• Research focus areas
• Any particular perspective or approach"
                    value={formData.instructions}
                    onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                    rows={8}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none text-base"
                  />
                  <p className="text-xs text-gray-500">
                    The more detailed your instructions, the better the AI can tailor the content
                  </p>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  {currentStep < STEPS.length ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={!canProceed}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center gap-2"
                    >
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isLoading || !formData.topic || !formData.instructions}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:opacity-50"
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
                  )}
                </div>

                {/* AI Chat Assistant Button */}
                <div className="flex justify-center pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowChatBot(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 hover:from-purple-100 hover:to-blue-100 text-purple-700 hover:text-purple-800"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Need Help? Ask AI Assistant
                  </Button>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">📝 Instruction Examples:</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• "Use APA citation style with at least 5 scholarly sources"</li>
                    <li>• "Focus on environmental and economic impacts"</li>
                    <li>• "Include case studies from developing countries"</li>
                    <li>• "Write for undergraduate level audience"</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Step 3: Configuration */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Paper Configuration</h3>
                  <p className="text-sm text-gray-600">Set your word count and formatting preferences</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="wordCount" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Target Word Count
                    </Label>
                    <Select
                      value={formData.wordCount.toString()}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, wordCount: parseInt(value) }))}
                    >
                      <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 py-3">
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
                        <SelectItem value="4000">4,000 words</SelectItem>
                        <SelectItem value="5000">5,000 words</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Estimated Reading Time
                    </Label>
                    <div className="h-11 px-3 py-2 border border-gray-200 rounded-md bg-gray-50 flex items-center text-sm text-gray-600">
                      {Math.ceil(formData.wordCount / 200)} minutes
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  {currentStep < STEPS.length ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={!canProceed}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center gap-2"
                    >
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isLoading || !formData.topic || !formData.instructions}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:opacity-50"
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
                  )}
                </div>

                {/* AI Chat Assistant Button */}
                <div className="flex justify-center pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowChatBot(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 hover:from-purple-100 hover:to-blue-100 text-purple-700 hover:text-purple-800"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Need Help? Ask AI Assistant
                  </Button>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">📊 Word Count Guide:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm text-purple-800">
                    <div>
                      <p className="font-medium">Short Papers:</p>
                      <p>500-1,000 words</p>
                    </div>
                    <div>
                      <p className="font-medium">Standard Essays:</p>
                      <p>1,500-2,500 words</p>
                    </div>
                    <div>
                      <p className="font-medium">Research Papers:</p>
                      <p>3,000-5,000 words</p>
                    </div>
                    <div>
                      <p className="font-medium">Thesis Chapters:</p>
                      <p>5,000+ words</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Reference Upload */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Reference Documents</h3>
                  <p className="text-sm text-gray-600">Upload supporting materials (optional)</p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Reference Document (Optional)
                  </Label>
                  <FileUpload onFileUpload={handleFileUpload} />
                  <p className="text-xs text-gray-500">
                    Upload research papers, articles, or other materials to help inform the content
                  </p>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  {currentStep < STEPS.length ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={!canProceed}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center gap-2"
                    >
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isLoading || !formData.topic || !formData.instructions}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:opacity-50"
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
                  )}
                </div>

                {/* AI Chat Assistant Button */}
                <div className="flex justify-center pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowChatBot(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 hover:from-purple-100 hover:to-blue-100 text-purple-700 hover:text-purple-800"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Need Help? Ask AI Assistant
                  </Button>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">📎 Supported Files:</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• PDF documents (.pdf)</li>
                    <li>• Word documents (.doc, .docx)</li>
                    <li>• Text files (.txt)</li>
                    <li>• Maximum file size: 10MB</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">📋 Summary of Your Paper:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Topic:</span>
                      <span className="font-medium text-gray-900 max-w-xs text-right">{formData.topic}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Word Count:</span>
                      <span className="font-medium text-gray-900">{formData.wordCount.toLocaleString()} words</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reading Time:</span>
                      <span className="font-medium text-gray-900">{Math.ceil(formData.wordCount / 200)} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reference File:</span>
                      <span className="font-medium text-gray-900">
                        {formData.referenceFileUrl ? 'Uploaded' : 'None'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* AI Chat Assistant Popup */}
      {showChatBot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Writing Assistant</h3>
                  <p className="text-xs opacity-90">Here to help with your paper</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChatBot(false)}
                className="text-white hover:bg-white hover:bg-opacity-20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 rounded-lg border border-purple-200">
                <p className="text-sm font-medium text-purple-800 mb-2">
                  💡 Step {currentStep} Suggestions:
                </p>
                <div className="space-y-2">
                  {getStepSuggestions(currentStep).map((suggestion, index) => (
                    <p key={index} className="text-sm text-purple-700">
                      • {suggestion}
                    </p>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-800 mb-2">
                  🤖 Quick Tips:
                </p>
                <div className="space-y-1 text-sm text-blue-700">
                  <p>• Be as specific as possible in your requirements</p>
                  <p>• Include your academic level for appropriate complexity</p>
                  <p>• Mention any specific sources or perspectives needed</p>
                  <p>• Don't forget to specify your citation style</p>
                </div>
              </div>

              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <p className="text-sm font-medium text-green-800 mb-2">
                  ✨ Pro Features:
                </p>
                <div className="space-y-1 text-sm text-green-700">
                  <p>• 100% original content generation</p>
                  <p>• Automatic plagiarism checking</p>
                  <p>• Human-like writing style</p>
                  <p>• Professional PDF formatting</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4">
              <Button
                onClick={() => setShowChatBot(false)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                Got it, thanks!
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
