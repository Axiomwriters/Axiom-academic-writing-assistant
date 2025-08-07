import { api } from "encore.dev/api";
import { Bucket } from "encore.dev/storage/objects";

const documentsBucket = new Bucket("academic-documents", {
  public: false,
  versioned: false
});

interface UploadDocumentRequest {
  fileName: string;
  fileData: string; // base64 encoded file data
  contentType: string;
}

interface UploadDocumentResponse {
  fileUrl: string;
  fileName: string;
}

// Uploads a reference document to cloud storage
export const uploadDocument = api<UploadDocumentRequest, UploadDocumentResponse>(
  { expose: true, method: "POST", path: "/writing/upload" },
  async (req) => {
    // Convert base64 to buffer
    const fileBuffer = Buffer.from(req.fileData, 'base64');
    
    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${req.fileName}`;
    
    // Upload to bucket
    await documentsBucket.upload(uniqueFileName, fileBuffer, {
      contentType: req.contentType
    });
    
    // Generate signed URL for access
    const { url } = await documentsBucket.signedDownloadUrl(uniqueFileName, {
      ttl: 3600 * 24 * 7 // 7 days
    });
    
    return {
      fileUrl: url,
      fileName: uniqueFileName
    };
  }
);
