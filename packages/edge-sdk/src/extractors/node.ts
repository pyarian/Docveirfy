// Node.js only. Never import this in the browser.
import pdfParse from 'pdf-parse';

export async function extractTextNode(buffer: Buffer): Promise<string> {
  const data = await pdfParse(buffer);

  if (!data.text || data.text.trim().length === 0) {
    throw new Error('PDF has no text layer. Must be a digitally generated PDF, not a scan.');
  }

  return data.text;
}
