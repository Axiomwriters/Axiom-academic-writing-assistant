// Configuration values for the frontend application

// Clerk publishable key for authentication (if needed in future)
// TODO: Set this to your Clerk publishable key if authentication is added
export const clerkPublishableKey = "";

// API endpoints and configuration
export const config = {
  // Maximum file upload size (10MB)
  maxFileSize: 10 * 1024 * 1024,
  
  // Supported file types for reference documents
  supportedFileTypes: [
    'application/pdf',
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ],
  
  // Default word count options
  wordCountOptions: [500, 750, 1000, 1500, 2000, 2500, 3000],
  
  // Quality score thresholds
  qualityThresholds: {
    excellent: 85,
    good: 70,
    fair: 55
  }
};
