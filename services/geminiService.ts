import { GoogleGenAI, Type } from "@google/genai";
import { Prize, GroundingSource } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    console.warn("Gemini API key not found. Using a placeholder. OCR and Prize Check functionality will be limited.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY || 'YOUR_API_KEY' });


/**
 * Extracts a 5-digit lottery number from a base64 encoded image.
 * @param base64Image The base64 encoded image string.
 * @returns A promise that resolves to the extracted 5-digit number string, or an empty string if not found.
 */
export const extractNumberFromImage = async (base64Image: string): Promise<string> => {
    try {
        const imagePart = {
            inlineData: {
                mimeType: 'image/jpeg',
                data: base64Image,
            },
        };
        const textPart = {
            text: 'Analiza esta imagen de un décimo de lotería y extrae únicamente el número principal de 5 dígitos. Devuelve solo los 5 dígitos, sin texto adicional.'
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });
        
        const text = response.text.trim().replace(/\s/g, '');
        if (/^\d{5}$/.test(text)) {
            return text;
        }
        return '';
    } catch (error) {
        console.error("Error calling Gemini API for OCR:", error);
        throw new Error("Failed to extract number from image.");
    }
};

/**
 * Fetches the latest Christmas Lottery results from the web using Google Search grounding.
 * @returns A promise that resolves to an object containing the prize list and the sources used.
 */
export const fetchPrizesFromWeb = async (): Promise<{ prizeList: Prize[]; sources: GroundingSource[] }> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `
                Busca en Google los resultados oficiales del Sorteo Extraordinario de Lotería de Navidad de 2025.
                Analiza los resultados y extrae los números premiados con su premio correspondiente por décimo (un décimo son 20€).
                Devuelve la respuesta como un array JSON válido. Cada objeto debe tener las claves "number" (string de 5 dígitos) y "prize" (número del premio por décimo).
                Enfócate en los premios principales (Gordo, Segundo, Tercero, etc.). No incluyas pedreas.
                El JSON debe estar limpio, sin texto antes o después.
            `,
            config: {
                tools: [{googleSearch: {}}],
            },
        });
        
        let jsonStr = response.text.trim();
        
        // Clean potential markdown formatting
        if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.substring(7, jsonStr.length - 3).trim();
        }

        const prizeList: Prize[] = JSON.parse(jsonStr);
        const sources: GroundingSource[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

        return { prizeList, sources };

    } catch (error: any) {
        console.error("Error fetching or parsing prize list from web:", error);
        if (error instanceof SyntaxError) {
             throw new Error("La IA ha devuelto una respuesta con formato incorrecto.");
        }
        throw new Error("No se pudo obtener la lista de premios desde la web.");
    }
};