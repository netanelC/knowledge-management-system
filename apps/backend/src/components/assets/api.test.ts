import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../index';
import { prisma } from '../../utils/prisma';

vi.mock('@aws-sdk/client-s3', () => {
  const S3ClientMock = vi.fn().mockImplementation(() => ({
    send: vi.fn().mockResolvedValue({
      Body: require('stream').Readable.from(['mock file content']),
      ContentType: 'text/plain',
    }),
  }));
  const PutObjectCommandMock = vi.fn();
  const GetObjectCommandMock = vi.fn();

  return {
    S3Client: S3ClientMock,
    PutObjectCommand: PutObjectCommandMock,
    GetObjectCommand: GetObjectCommandMock,
  };
});

const createMockTextFile = () => ({
  content: 'fake content ' + Math.random().toString(),
  filename: 'mockfile_' + Date.now() + '.txt',
});

const createMockImageFile = () => ({
  content: 'fake image data ' + Math.random().toString(),
  filename: 'mockimage_' + Date.now() + '.png',
  mimetype: 'image/png',
});

const buildAssetRecord = (overrides = {}) => ({
  filename: 'mockfile_' + Date.now() + '.txt',
  type: 'DOCUMENT' as const,
  ...overrides,
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
      expect(asset).toHaveProperty('createdAt');
      expect(asset).toHaveProperty('type', 'DOCUMENT');
    });

    it('should upload an image and set type to IMAGE', async () => {
      // Arrange
      const mockFile = createMockImageFile();
      const buffer = Buffer.from(mockFile.content);

      // Act
      const response = await request(app)
        .post('/api/assets')
        .attach('file', buffer, mockFile.filename);

      // Assert
      expect(response.status).toBe(201);
      const asset = response.body.asset;
      expect(asset).toHaveProperty('type', 'IMAGE');
    });

    it('should return 400 if no file is uploaded', async () => {
      // Act
      const response = await request(app).post('/api/assets');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'No file uploaded');
    });
  });

  describe('GET /api/assets', () => {
    beforeEach(async () => {
      await prisma.asset.deleteMany();
    });

    it('should return a list of assets', async () => {
      // Arrange
      await prisma.asset.createMany({
        data: [buildAssetRecord(), buildAssetRecord()],
      });

      // Act
      const response = await request(app).get('/api/assets');

      // Assert
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toHaveProperty('filename');
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('type', 'DOCUMENT');
      expect(response.body[0]).toHaveProperty('createdAt');
    });
  });

  describe('GET /api/assets/:id/download', () => {
    it('should download an asset', async () => {
      // Arrange
      const assetRecord = buildAssetRecord();
      const asset = await prisma.asset.create({
        data: assetRecord,
      });

      // Act
      const response = await request(app).get(`/api/assets/${asset.id}/download`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('text/plain');
    });

    it('should return 404 for non-existent asset', async () => {
      // Act
      const response = await request(app).get(`/api/assets/non-existent-id/download`);

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Asset not found');
    });
  });
});
