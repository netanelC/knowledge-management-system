import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../index';

vi.mock('@aws-sdk/client-s3', () => {
  const S3ClientMock = vi.fn().mockImplementation(() => ({
    send: vi.fn().mockResolvedValue({}),
  }));
  const PutObjectCommandMock = vi.fn();

  return {
    S3Client: S3ClientMock,
    PutObjectCommand: PutObjectCommandMock,
  };
});

const createMockTextFile = () => ({
  content: 'fake content ' + Math.random().toString(),
  filename: 'mockfile_' + Date.now() + '.txt',
});

describe('Assets API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
      expect(response.body).toHaveProperty('message', 'File uploaded successfully');
      expect(response.body).toHaveProperty('asset');

      const asset = response.body.asset;
      expect(asset).toHaveProperty('id');
      expect(typeof asset.id).toBe('string');
      expect(asset).toHaveProperty('filename', mockFile.filename);
      expect(asset).toHaveProperty('s3Key', asset.id);
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
