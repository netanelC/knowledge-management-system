import { GoogleGenAI } from '@google/genai';
import config from 'config';
import { logger } from './logger';
import { AssetFormat, type GeneratedMetadata } from '../types';

export type { GeneratedMetadata };

interface FormatMetadataStrategy {
  generate(buffer: Buffer, mimeType: string): Promise<GeneratedMetadata | null>;
}

const queryGeminiModel = async (
  contents: string | Array<string | { inlineData: { data: string; mimeType: string } }>,
  logContext: string,
): Promise<GeneratedMetadata | null> => {
  try {
    const apiKey = config.get<string>('gemini.apiKey');
    const modelName = config.get<string>('gemini.model');

    if (!apiKey) {
      logger.warn('Gemini API key is not configured; skipping AI metadata generation.');
      return null;
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: modelName,
      contents,
    });

    const rawText = (response.text || '').trim();
    const cleanJson = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/, '')
      .replace(/\s*```$/, '')
      .trim();

    const parsed = JSON.parse(cleanJson || '{}');

    return {
      description: typeof parsed.description === 'string' ? parsed.description : '',
      keywords: Array.isArray(parsed.keywords)
        ? parsed.keywords.join(', ')
        : typeof parsed.keywords === 'string'
          ? parsed.keywords
          : '',
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
      logger.error({ err: error }, `Failed to generate ${logContext} via Gemini`);
    }
    return null;
  }
};

// --- STRATEGY IMPLEMENTATIONS ---

class TextMetadataStrategy implements FormatMetadataStrategy {
  async generate(buffer: Buffer, _mimeType: string): Promise<GeneratedMetadata | null> {
    const text = buffer.toString('utf-8');
    if (!text.trim()) return null;

    const prompt = `Analyze the following document text and return a JSON object with two properties:
1. "description": A concise 1-2 sentence summary of the document.
2. "keywords": A comma-separated string of 3-5 relevant keywords/tags.

Do not include any extra commentary. Output JSON only.

Document text:
${text}`;

    return await queryGeminiModel(prompt, 'document metadata');
  }
}

class ImageMetadataStrategy implements FormatMetadataStrategy {
  async generate(buffer: Buffer, mimeType: string): Promise<GeneratedMetadata | null> {
    const imagePart = {
      inlineData: {
        data: buffer.toString('base64'),
        mimeType,
      },
    };

    const prompt = `Analyze the following image and return a JSON object with two properties:
1. "description": A concise 1-2 sentence visual description of what is depicted in the image.
2. "keywords": A comma-separated string of 3-5 relevant keywords/tags describing the image content, colors, objects, or scene.

Do not include any extra commentary. Output JSON only.`;

    return await queryGeminiModel([imagePart, prompt], 'image metadata');
  }
}

// Strategy Registry
const formatStrategies: Partial<Record<AssetFormat, FormatMetadataStrategy>> = {
  [AssetFormat.TEXT]: new TextMetadataStrategy(),
  [AssetFormat.IMAGE]: new ImageMetadataStrategy(),
};

// Single Public Entry Point
export const generateMetadataForAsset = async (
  type: AssetFormat,
  buffer: Buffer,
  mimeType: string,
): Promise<GeneratedMetadata | null> => {
  const strategy = formatStrategies[type];
  if (!strategy) {
    logger.info(`No metadata generator configured for asset format: ${type}`);
    return null;
  }

  return await strategy.generate(buffer, mimeType);
};
