import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../index';
import * as geminiModule from '../../utils/gemini';

const createMockTextFile = () => ({
  content: 'fake content ' + Math.random().toString(),
  filename: 'mockfile_' + Date.now() + '.txt',
});

describe('Assets API', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(geminiModule, 'generateMetadataForAsset').mockResolvedValue(null);
  });

  describe('POST /api/assets', () => {
    it('should upload a file and return metadata', async () => {
      // Arrange
      const mockFile = createMockTextFile();
      const buffer = Buffer.from(mockFile.content);

      // Act
      const response = await request(app)
        .post('/api/assets')
        .attach('file', buffer, mockFile.filename);

      // Assert
      expect(response.status).toBe(201);

      const asset = response.body;
      expect(asset).toHaveProperty('id');
      expect(typeof asset.id).toBe('string');
      expect(asset).toHaveProperty('filename', mockFile.filename);
      expect(asset).toHaveProperty('size');
      expect(asset).toHaveProperty('type', 'TEXT');
      expect(asset).toHaveProperty('extractedText', mockFile.content);
      expect(asset).toHaveProperty('createdAt');
    });

    it('should generate metadata for text documents when Gemini is configured', async () => {
      // Arrange
      const geminiSpy = vi.spyOn(geminiModule, 'generateMetadataForAsset').mockResolvedValueOnce({
        description: 'Mock document description',
        keywords: 'mock, text, test',
      });

      const mockFile = createMockTextFile();
      const buffer = Buffer.from(mockFile.content);

      // Act
      const response = await request(app)
        .post('/api/assets')
        .attach('file', buffer, mockFile.filename);

      // Assert
      expect(response.status).toBe(201);
      const asset = response.body;
      expect(asset).toHaveProperty('metadata');
      expect(asset.metadata).toEqual({
        assetId: asset.id,
        description: 'Mock document description',
        keywords: 'mock, text, test',
      });

      geminiSpy.mockRestore();
    });

    it('should upload an image file and return metadata with IMAGE type', async () => {
      // Arrange
      const mockFile = {
        content: 'fake image content ' + Math.random().toString(),
        filename: 'mockimage_' + Date.now() + '.png',
      };
      const buffer = Buffer.from(mockFile.content);

      // Act
      const response = await request(app)
        .post('/api/assets')
        .attach('file', buffer, { filename: mockFile.filename, contentType: 'image/png' });

      // Assert
      expect(response.status).toBe(201);
      const asset = response.body;
      expect(asset).toHaveProperty('id');
      expect(asset).toHaveProperty('type', 'IMAGE');
    });

    it('should generate visual metadata for image uploads when Gemini is configured', async () => {
      // Arrange
      const geminiVisionSpy = vi
        .spyOn(geminiModule, 'generateMetadataForAsset')
        .mockResolvedValueOnce({
          description: 'Mock visual image description',
          keywords: 'mock, image, visual, test',
        });

      const mockFile = {
        content: 'fake image content ' + Math.random().toString(),
        filename: 'mockimage_' + Date.now() + '.png',
      };
      const buffer = Buffer.from(mockFile.content);

      // Act
      const response = await request(app)
        .post('/api/assets')
        .attach('file', buffer, { filename: mockFile.filename, contentType: 'image/png' });

      // Assert
      expect(response.status).toBe(201);
      const asset = response.body;
      expect(asset).toHaveProperty('metadata');
      expect(asset.metadata).toEqual({
        assetId: asset.id,
        description: 'Mock visual image description',
        keywords: 'mock, image, visual, test',
      });

      geminiVisionSpy.mockRestore();
    });

    it('should return 400 if no file is uploaded', async () => {
      // Arrange
      const response = await request(app).post('/api/assets');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'No file uploaded');
    });
  });

  describe('GET /api/assets', () => {
    it('should return 200 and a list of assets', async () => {
      // Arrange
      const mockFiles = [createMockTextFile(), createMockTextFile()];

      for (const mockFile of mockFiles) {
        await request(app)
          .post('/api/assets')
          .attach('file', Buffer.from(mockFile.content), mockFile.filename);
      }

      // Act
      const response = await request(app).get('/api/assets');

      // Assert
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.assets)).toBe(true);
      expect(response.body.assets.length).toBeGreaterThanOrEqual(2);

      const filenames = response.body.assets.map((a: { filename: string }) => a.filename);
      expect(filenames).toContain(mockFiles[0].filename);
      expect(filenames).toContain(mockFiles[1].filename);
    });

    it('should return filtered assets matching query parameter q', async () => {
      // Arrange
      const searchTargetFilename = 'special_quantum_report_' + Date.now() + '.txt';
      const otherFilename = 'unrelated_file_' + Date.now() + '.txt';

      await request(app)
        .post('/api/assets')
        .attach('file', Buffer.from('quantum computing notes'), searchTargetFilename);

      await request(app)
        .post('/api/assets')
        .attach('file', Buffer.from('regular text content'), otherFilename);

      // Act: Search for 'quantum'
      const response = await request(app).get('/api/assets?q=quantum');

      // Assert
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.assets)).toBe(true);

      const returnedFilenames = response.body.assets.map((a: { filename: string }) => a.filename);
      expect(returnedFilenames).toContain(searchTargetFilename);
      expect(returnedFilenames).not.toContain(otherFilename);
    });

    it('should return filtered assets matching query parameter q against AI metadata description and keywords', async () => {
      // Arrange
      const targetFilename = 'ai_search_test_' + Date.now() + '.txt';
      const geminiSpy = vi.spyOn(geminiModule, 'generateMetadataForAsset').mockResolvedValueOnce({
        description: 'Deep neural network architecture overview',
        keywords: 'astronomy, astrophysics, space',
      });

      await request(app)
        .post('/api/assets')
        .attach('file', Buffer.from('some text'), targetFilename);

      // Act 1: Search by description keyword
      const descResponse = await request(app).get('/api/assets?q=neural');
      expect(descResponse.status).toBe(200);
      const descFilenames = descResponse.body.assets.map((a: { filename: string }) => a.filename);
      expect(descFilenames).toContain(targetFilename);

      // Act 2: Search by tag keyword
      const tagResponse = await request(app).get('/api/assets?q=astrophysics');
      expect(tagResponse.status).toBe(200);
      const tagFilenames = tagResponse.body.assets.map((a: { filename: string }) => a.filename);
      expect(tagFilenames).toContain(targetFilename);

      geminiSpy.mockRestore();
    });

    it('should return assets matching multi-word natural language search terms', async () => {
      // Arrange
      const targetFilename = 'portrait_' + Date.now() + '.jpg';
      const geminiSpy = vi.spyOn(geminiModule, 'generateMetadataForAsset').mockResolvedValueOnce({
        description: 'A portrait of a person with dark features',
        keywords: 'black, hair, model, studio',
      });

      await request(app).post('/api/assets').attach('file', Buffer.from('fake image content'), {
        filename: targetFilename,
        contentType: 'image/jpeg',
      });

      // Act: Search for "portrait"
      const response = await request(app).get('/api/assets?q=portrait');

      // Assert
      expect(response.status).toBe(200);
      const filenames = response.body.assets.map((a: { filename: string }) => a.filename);
      expect(filenames).toContain(targetFilename);

      geminiSpy.mockRestore();
    });
  });

  describe('GET /api/assets/:id/content', () => {
    it('should return 200 and the file content for a valid id', async () => {
      // Arrange: Create a file
      const mockFile = createMockTextFile();
      const buffer = Buffer.from(mockFile.content);

      const postResponse = await request(app)
        .post('/api/assets')
        .attach('file', buffer, mockFile.filename);

      const assetId = postResponse.body.id;

      // Act
      const getResponse = await request(app).get(`/api/assets/${assetId}/content`);

      // Assert
      expect(getResponse.status).toBe(200);
      expect(getResponse.text).toBe(mockFile.content);
    });

    it('should return 404 for a non-existent asset ID', async () => {
      const getResponse = await request(app).get(
        '/api/assets/invalid-id-that-does-not-exist/content',
      );
      expect(getResponse.status).toBe(404);
    });

    it('should return 200 and image/png content for a valid image asset ID', async () => {
      // Arrange: Create a mock image file
      const mockFile = {
        content: Buffer.from(
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
          'base64',
        ),
        filename: 'test.png',
      };

      const postResponse = await request(app).post('/api/assets').attach('file', mockFile.content, {
        filename: mockFile.filename,
        contentType: 'image/png',
      });

      const assetId = postResponse.body.id;

      // Act
      const getResponse = await request(app).get(`/api/assets/${assetId}/content`);

      // Assert
      expect(getResponse.status).toBe(200);
      expect(getResponse.headers['content-type']).toBe('image/png');
      expect(getResponse.body).toBeInstanceOf(Buffer);
    });
  });
});
