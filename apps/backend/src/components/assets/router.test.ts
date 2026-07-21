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
      expect(asset).toHaveProperty('createdAt');
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
});
