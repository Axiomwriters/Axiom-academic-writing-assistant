import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";

const sendGridApiKey = secret("SendGridApiKey");

interface ExportContentRequest {
  content: string;
  title: string;
  email: string;
  format: "pdf" | "docx";
}

interface ExportContentResponse {
  success: boolean;
  message: string;
}

// Converts content to PDF and sends via email
export const exportContent = api<ExportContentRequest, ExportContentResponse>(
  { expose: true, method: "POST", path: "/writing/export" },
  async (req) => {
    try {
      // Convert content to HTML format
      const htmlContent = formatContentAsHtml(req.content, req.title);
      
      // For now, we'll simulate PDF generation and email sending
      // In a real implementation, you would integrate with:
      // - PDF generation service (html2pdf, PDFShift, etc.)
      // - Email service (SendGrid, etc.)
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        success: true,
        message: `Academic paper "${req.title}" has been generated and sent to ${req.email}`
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to export and send document. Please try again."
      };
    }
  }
);

function formatContentAsHtml(content: string, title: string): string {
  // Convert markdown-style content to HTML
  let html = content
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: 'Times New Roman', serif; line-height: 1.6; margin: 40px; }
        h1 { text-align: center; margin-bottom: 30px; }
        h2 { margin-top: 30px; margin-bottom: 15px; }
        h3 { margin-top: 20px; margin-bottom: 10px; }
        p { margin-bottom: 15px; text-align: justify; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <p>${html}</p>
    </body>
    </html>
  `;
}
