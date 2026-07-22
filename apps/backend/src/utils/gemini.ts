import { GoogleGenAI } from '@google/genai';
import config from 'config';
import { logger } from './logger';

export type GeneratedMetadata = {
  description: string;
  keywords: string;
};

export const generateDocumentMetadata = async (
  extractedText: string,
): Promise<GeneratedMetadata | null> => {
  try {
    const apiKey = config.has('gemini.apiKey') ? config.get<string>('gemini.apiKey') : '';

    const modelName = config.get<string>('gemini.model');

    if (!apiKey) {
      logger.warn('Gemini API key is not configured; skipping AI metadata generation.');
      return null;
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Analyze the following document text and return a JSON object with two properties:
1. "description": A concise 1-2 sentence summary of the document.
2. "keywords": A comma-separated string of 3-5 relevant keywords/tags.

Do not include any extra commentary. Output JSON only.

Document text:
${extractedText}`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });

    const textResponse = (response.text || '').trim();

    const cleanJson = textResponse
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/, '')
      .replace(/\s*```$/, '')
      .trim();

    const parsed = JSON.parse(cleanJson);

    const description = typeof parsed.description === 'string' ? parsed.description : '';
    const keywords = Array.isArray(parsed.keywords)
      ? parsed.keywords.join(', ')
      : typeof parsed.keywords === 'string'
        ? parsed.keywords
        : '';

    return {
      description,
      keywords,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    if (
      message.includes('429') ||
      message.includes('RESOURCE_EXHAUSTED') ||
      message.includes('Quota exceeded')
    ) {
      logger.warn(
        'Gemini API quota or rate limit exceeded (429 RESOURCE_EXHAUSTED); skipping AI metadata generation.',
      );
    } else {
      logger.error({ error: message }, 'Failed to generate document metadata via Gemini');
    }
    return null;
  }
};
