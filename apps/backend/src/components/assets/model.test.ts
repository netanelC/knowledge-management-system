import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createAssetRecord } from './model';
import * as DAL from './DAL';
import { prisma } from '../../utils/prisma';
import { AssetFormat } from '../../types';
import * as geminiModule from '../../utils/gemini';

describe('Assets Model', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(geminiModule, 'generateMetadataForAsset').mockResolvedValue(null);
  });

  it('should throw error and clean up DB record if S3 upload fails', async () => {
    // Arrange
    const filename = 'test_s3_fail_' + Date.now() + '.txt';
    const mockFile = {
      filename,
      size: 1024,
      buffer: Buffer.from('test content'),
      type: AssetFormat.TEXT,
      mimetype: 'text/plain',
    };

    const spy = vi
      .spyOn(DAL, 'uploadFileToS3')
      .mockRejectedValueOnce(new Error('S3 connection failed'));

    // Act & Assert
    await expect(createAssetRecord(mockFile)).rejects.toThrow('S3 connection failed');

    // Verify DB is clean
    const count = await prisma.asset.count({ where: { filename } });
    expect(count).toBe(0);

    spy.mockRestore();
  });

  it('should extract text content for text files and set extractedText in DB', async () => {
    const textContent = 'Hello world text extraction content';
    const mockFile = {
      filename: 'sample_' + Date.now() + '.txt',
      size: textContent.length,
      buffer: Buffer.from(textContent),
      type: AssetFormat.TEXT,
      mimetype: 'text/plain',
    };

    const spy = vi.spyOn(DAL, 'uploadFileToS3').mockResolvedValueOnce();

    const asset = await createAssetRecord(mockFile);
    expect(asset.extractedText).toBe(textContent);

    const dbRecord = await prisma.asset.findUnique({ where: { id: asset.id } });
    expect(dbRecord?.extractedText).toBe(textContent);

    spy.mockRestore();
  });

  it('should generate and save AI metadata when uploading a text document', async () => {
    const textContent = 'Document content about artificial intelligence and node.js testing.';
    const mockFile = {
      filename: 'ai_doc_' + Date.now() + '.txt',
      size: textContent.length,
      buffer: Buffer.from(textContent),
      type: AssetFormat.TEXT,
      mimetype: 'text/plain',
    };

    const s3Spy = vi.spyOn(DAL, 'uploadFileToS3').mockResolvedValueOnce();

    const geminiSpy = vi.spyOn(geminiModule, 'generateMetadataForAsset').mockResolvedValueOnce({
      description: 'Document about AI and Node.js.',
      keywords: 'AI, Node.js, Testing',
    });

    const asset = await createAssetRecord(mockFile);

    expect(geminiSpy).toHaveBeenCalledWith(AssetFormat.TEXT, mockFile.buffer, mockFile.mimetype);
    expect(asset.metadata).toBeDefined();
    expect(asset.metadata?.description).toBe('Document about AI and Node.js.');
    expect(asset.metadata?.keywords).toBe('AI, Node.js, Testing');

    const dbRecord = await prisma.assetMetadata.findUnique({ where: { assetId: asset.id } });
    expect(dbRecord).not.toBeNull();
    expect(dbRecord?.description).toBe('Document about AI and Node.js.');

    s3Spy.mockRestore();
    geminiSpy.mockRestore();
  });

  it('should generate and save AI visual metadata when uploading an image file', async () => {
    const imageBuffer = Buffer.from('fake binary image');
    const mockFile = {
      filename: 'landscape_' + Date.now() + '.png',
      size: imageBuffer.length,
      buffer: imageBuffer,
      type: AssetFormat.IMAGE,
      mimetype: 'image/png',
    };

    const s3Spy = vi.spyOn(DAL, 'uploadFileToS3').mockResolvedValueOnce();

    const geminiVisionSpy = vi
      .spyOn(geminiModule, 'generateMetadataForAsset')
      .mockResolvedValueOnce({
        description: 'A beautiful mountain landscape during sunset.',
        keywords: 'mountain, sunset, landscape, nature',
      });

    const asset = await createAssetRecord(mockFile);

    expect(geminiVisionSpy).toHaveBeenCalledWith(AssetFormat.IMAGE, imageBuffer, 'image/png');
    expect(asset.metadata).toBeDefined();
    expect(asset.metadata?.description).toBe('A beautiful mountain landscape during sunset.');
    expect(asset.metadata?.keywords).toBe('mountain, sunset, landscape, nature');

    const dbRecord = await prisma.assetMetadata.findUnique({ where: { assetId: asset.id } });
    expect(dbRecord).not.toBeNull();
    expect(dbRecord?.description).toBe('A beautiful mountain landscape during sunset.');

    s3Spy.mockRestore();
    geminiVisionSpy.mockRestore();
  });
});
