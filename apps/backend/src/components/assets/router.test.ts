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
      expect(asset).toHaveProperty('s3Key', null);
      expect(asset).toHaveProperty('createdAt');
    });

    it('should return 400 if no file is uploaded', async () => {
      // Arrange
      // Act
      const response = await request(app).post('/api/assets');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'No file uploaded');
    });
  });
});
