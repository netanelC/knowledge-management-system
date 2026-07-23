import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateMetadataForAsset } from './gemini';
import { GoogleGenAI } from '@google/genai';
import { AssetFormat } from '@prisma/client';

vi.mock('@google/genai');

describe('Gemini Utility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate text document metadata via generateMetadataForAsset', async () => {
    const fakeText = 'This is a sample document about artificial intelligence and node.js.';
    const buffer = Buffer.from(fakeText);
    const mockJsonResponse = JSON.stringify({
      description: 'A document discussing AI and Node.js.',
      keywords: 'AI, Node.js, JavaScript',
    });

    const mockGenerateContent = vi.fn().mockResolvedValue({
      text: mockJsonResponse,
    });

    vi.mocked(GoogleGenAI).mockImplementation(
      () =>
        ({
          models: {
            generateContent: mockGenerateContent,
          },
        }) as unknown as GoogleGenAI,
    );

    const metadata = await generateMetadataForAsset(AssetFormat.TEXT, buffer, 'text/plain');

    expect(metadata).toEqual({
      description: 'A document discussing AI and Node.js.',
      keywords: 'AI, Node.js, JavaScript',
    });
    expect(mockGenerateContent).toHaveBeenCalled();
  });

  it('should parse markdown json block formatting if returned by Gemini', async () => {
    const fakeText = 'Sample text';
    const buffer = Buffer.from(fakeText);
    const mockMarkdownJson =
      '```json\n{"description": "Test summary", "keywords": "test, summary"}\n```';

    const mockGenerateContent = vi.fn().mockResolvedValue({
      text: mockMarkdownJson,
    });

    vi.mocked(GoogleGenAI).mockImplementation(
      () =>
        ({
          models: {
            generateContent: mockGenerateContent,
          },
        }) as unknown as GoogleGenAI,
    );

    const metadata = await generateMetadataForAsset(AssetFormat.TEXT, buffer, 'text/plain');

    expect(metadata).toEqual({
      description: 'Test summary',
      keywords: 'test, summary',
    });
  });

  it('should return null if Gemini API fails', async () => {
    vi.mocked(GoogleGenAI).mockImplementation(
      () =>
        ({
          models: {
            generateContent: vi.fn().mockRejectedValue(new Error('API quota exceeded')),
          },
        }) as unknown as GoogleGenAI,
    );

    const metadata = await generateMetadataForAsset(
      AssetFormat.TEXT,
      Buffer.from('Some text'),
      'text/plain',
    );
    expect(metadata).toBeNull();
  });

  it('should generate image metadata using GoogleGenAI vision capabilities', async () => {
    const fakeBuffer = Buffer.from('fake image content');
    const mockJsonResponse = JSON.stringify({
      description: 'A photo of a sunset over the mountains.',
      keywords: 'sunset, mountain, nature, sky',
    });

    const mockGenerateContent = vi.fn().mockResolvedValue({
      text: mockJsonResponse,
    });

    vi.mocked(GoogleGenAI).mockImplementation(
      () =>
        ({
          models: {
            generateContent: mockGenerateContent,
          },
        }) as unknown as GoogleGenAI,
    );

    const metadata = await generateMetadataForAsset(AssetFormat.IMAGE, fakeBuffer, 'image/jpeg');

    expect(metadata).toEqual({
      description: 'A photo of a sunset over the mountains.',
      keywords: 'sunset, mountain, nature, sky',
    });
    expect(mockGenerateContent).toHaveBeenCalledWith(
      expect.objectContaining({
        contents: expect.arrayContaining([
          expect.objectContaining({
            inlineData: {
              data: fakeBuffer.toString('base64'),
              mimeType: 'image/jpeg',
            },
          }),
        ]),
      }),
    );
  });
});
