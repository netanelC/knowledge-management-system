import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateDocumentMetadata } from './gemini';
import { GoogleGenAI } from '@google/genai';

vi.mock('@google/genai');

describe('Gemini Utility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate document metadata using GoogleGenAI', async () => {
    const fakeText = 'This is a sample document about artificial intelligence and node.js.';
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

    const metadata = await generateDocumentMetadata(fakeText);

    expect(metadata).toEqual({
      description: 'A document discussing AI and Node.js.',
      keywords: 'AI, Node.js, JavaScript',
    });
    expect(mockGenerateContent).toHaveBeenCalled();
  });

  it('should parse markdown json block formatting if returned by Gemini', async () => {
    const fakeText = 'Sample text';
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

    const metadata = await generateDocumentMetadata(fakeText);

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

    const metadata = await generateDocumentMetadata('Some text');
    expect(metadata).toBeNull();
  });
});
