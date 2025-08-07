import React from 'react';
import { GraduationCap, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-blue-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <Sparkles className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AcademicAI</h1>
              <p className="text-sm text-gray-600">Smart Writing Assistant</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <div className="text-sm text-gray-600">
              <span className="font-medium">100%</span> Original Content
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">AI-Powered</span> Research
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Instant</span> Delivery
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
