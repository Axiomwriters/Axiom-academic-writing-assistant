import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, File, X, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';

interface FileUploadProps {
  onFileUpload: (fileUrl: string, fileName?: string) => void;
}

export default function FileUpload({ onFileUpload }: FileUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOC, DOCX, or TXT file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        const base64Content = base64Data.split(',')[1]; // Remove data:type;base64, prefix

        try {
          const response = await backend.writing.uploadDocument({
            fileName: file.name,
            fileData: base64Content,
            contentType: file.type,
          });

          setUploadedFile(file.name);
          onFileUpload(response.fileUrl, file.name);
          
          toast({
            title: "File uploaded successfully",
            description: `${file.name} has been uploaded and will be used as reference.`,
          });
        } catch (error) {
          console.error('Upload error:', error);
          toast({
            title: "Upload failed",
            description: "Failed to upload file. Please try again.",
            variant: "destructive",
          });
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('File processing error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to process file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    onFileUpload('', '');
  };

  return (
    <div className="space-y-3">
      {!uploadedFile ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center space-y-2">
              <Upload className="h-8 w-8 text-gray-400" />
              <div className="text-sm text-gray-600">
                <span className="font-medium text-blue-600 hover:text-blue-500">
                  Click to upload
                </span>{' '}
                or drag and drop
              </div>
              <div className="text-xs text-gray-500">
                PDF, DOC, DOCX, or TXT (max 10MB)
              </div>
            </div>
          </label>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">{uploadedFile}</p>
              <p className="text-xs text-green-600">File uploaded successfully</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={removeFile}
            className="text-green-600 hover:text-green-800 hover:bg-green-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {isUploading && (
        <div className="flex items-center justify-center p-4">
          <div className="flex items-center space-x-2 text-blue-600">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Uploading file...</span>
          </div>
        </div>
      )}
    </div>
  );
}
