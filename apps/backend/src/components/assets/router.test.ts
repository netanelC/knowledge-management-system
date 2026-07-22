import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../index';

const createMockTextFile = () => ({
  content: 'fake content ' + Math.random().toString(),
  filename: 'mockfile_' + Date.now() + '.txt',
});

describe('Assets API', () => {
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
