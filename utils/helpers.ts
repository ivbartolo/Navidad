// We need to import the pdfjs library from a CDN
import * as pdfjs from 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.min.mjs';
// Set the workerSrc for pdf.js
// @ts-ignore
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs`;

/**
 * Converts a File object to a base64 encoded string.
 * @param file The file to convert.
 * @returns A promise that resolves with the base64 string (without the data URL prefix).
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix e.g. "data:image/jpeg;base64,"
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Reads the text content from a PDF file.
 * @param file The PDF file.
 * @returns A promise that resolves with the extracted text content as a single string.
 */
export const readPdfText = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument(arrayBuffer).promise;
  let allText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => ('str' in item ? item.str : '')).join(' ');
    allText += pageText + '\n';
  }
  
  return allText;
};