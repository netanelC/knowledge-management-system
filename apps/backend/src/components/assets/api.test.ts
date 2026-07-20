import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../index';

describe('Assets API', () => {
  describe('POST /api/assets', () => {
    it('should upload a file and return metadata', async () => {
      // Arrange
      const buffer = Buffer.from('hello world');

      // Act
      const response = await request(app).post('/api/assets').attach('file', buffer, 'test.txt');

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'File uploaded successfully');
      expect(response.body).toHaveProperty('asset');
      expect(response.body.asset).toHaveProperty('originalName', 'test.txt');
      expect(response.body.asset).toHaveProperty('size', buffer.length);
      expect(response.body.asset).toHaveProperty('mimeType', 'text/plain');
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
