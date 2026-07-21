import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { vi } from 'vitest';
import app from '../../index';
import * as storage from './storage';
import { prisma } from '../../utils/prisma';

vi.mock('./storage', () => ({
  uploadFile: vi.fn().mockResolvedValue(undefined),
}));

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

      // Verify S3 was called correctly with any ID, a Readable stream, and content length
      expect(storage.uploadFile).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.any(Number),
      );
    });

    it('should return 500 and not leave orphaned DB records if S3 fails', async () => {
      // Arrange
      const mockFile = createMockTextFile();
      const buffer = Buffer.from(mockFile.content);
      vi.mocked(storage.uploadFile).mockRejectedValueOnce(new Error('S3 connection failed'));

      // Act
      const response = await request(app)
        .post('/api/assets')
        .attach('file', buffer, mockFile.filename);

      // Assert
      expect(response.status).toBe(500);
      expect(response.body.error).toContain('Failed to upload asset');

      // Verify DB is clean
      const count = await prisma.asset.count({ where: { filename: mockFile.filename } });
      expect(count).toBe(0);
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
