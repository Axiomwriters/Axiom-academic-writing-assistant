import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Mail, FileText, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';

interface ExportOptionsProps {
  content: string;
  title: string;
}

export default function ExportOptions({ content, title }: ExportOptionsProps) {
  const [email, setEmail] = useState('');
  const [format, setFormat] = useState<'pdf' | 'docx'>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to receive the document.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);

    try {
      const response = await backend.writing.exportContent({
        content,
        title,
        email,
        format,
      });

      if (response.success) {
        toast({
          title: "Export successful!",
          description: response.message,
        });
        setEmail('');
      } else {
        toast({
          title: "Export failed",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "An error occurred while exporting your document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = () => {
    // Create a blob with the content
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Your document is being downloaded as a text file.",
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Send className="h-5 w-5" />
          <span>Export & Delivery Options</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="format">Export Format</Label>
            <Select value={format} onValueChange={(value: 'pdf' | 'docx') => setFormat(value)}>
              <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Document</SelectItem>
                <SelectItem value="docx">Word Document</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleExport}
            disabled={isExporting || !email}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            {isExporting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating & Sending...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email {format.toUpperCase()}
              </div>
            )}
          </Button>
          
          <Button
            onClick={handleDownload}
            variant="outline"
            className="flex-1 border-gray-300 hover:bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Text
            </div>
          </Button>
        </div>

        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <p className="font-medium text-blue-800 mb-1">What you'll receive:</p>
          <ul className="space-y-1 text-blue-700">
            <li>• Professionally formatted {format.toUpperCase()} document</li>
            <li>• Proper academic structure with headings</li>
            <li>• Clean typography optimized for submission</li>
            <li>• Quality assurance report included</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
