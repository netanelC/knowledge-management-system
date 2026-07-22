import { describe, it, expect, vi } from 'vitest';
import { createAssetRecord } from './model';
import * as DAL from './DAL';
import { prisma } from '../../utils/prisma';
import { AssetFormat } from '@prisma/client';

describe('Assets Model', () => {
  it('should throw error and clean up DB record if S3 upload fails', async () => {
    // Arrange
    const mockFile = {
      filename: 'test.txt',
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
    const count = await prisma.asset.count({ where: { filename: mockFile.filename } });
    expect(count).toBe(0);

    spy.mockRestore();
  });
});
