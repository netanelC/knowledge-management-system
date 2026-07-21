import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../index';
import { prisma } from '../../utils/prisma';

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
  beforeEach(async () => {
    vi.clearAllMocks();
    await prisma.asset.deleteMany();
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
      expect(asset).toHaveProperty('createdAt');
    });

    it('should return 400 when no file is provided', async () => {
      // Act
      const response = await request(app).post('/api/assets');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'No file uploaded');
    });
  });

  describe('GET /api/assets', () => {
    it('should return a list of assets', async () => {
      // Arrange
      await prisma.asset.createMany({
        data: [{ filename: 'test1.txt' }, { filename: 'test2.txt' }],
      });

      // Act
      const response = await request(app).get('/api/assets');

      // Assert
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toHaveProperty('filename');
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('createdAt');
    });
  });
});
