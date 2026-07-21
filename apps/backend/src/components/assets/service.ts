import { AssetUploadResponse, Asset } from 'types';
import { AppError } from '../../utils/error';
import { prisma } from '../../utils/prisma';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, bucketName } from '../../utils/s3';
import { Readable } from 'stream';

export interface AssetUploadInput {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
}

const validateTextFile = (file: AssetUploadInput) => {
  const isText = file.mimetype.startsWith('text/') || file.originalname.match(/\.(txt|md|csv)$/i);
  if (!isText) {
    throw new AppError('Invalid file type. Only text files are allowed.', 400);
  }
};

export const handleAssetUpload = async (
  file: AssetUploadInput | undefined,
): Promise<AssetUploadResponse> => {
  if (!file) {
    throw new AppError('No file uploaded', 400);
  }

  validateTextFile(file);

  const asset = await prisma.asset.create({
    data: {
      filename: file.originalname,
    },
  });

  try {
    const stream = Readable.from(file.buffer);
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: asset.id,
      Body: stream,
      ContentType: file.mimetype,
      ContentLength: file.buffer.length,
    });
    await s3Client.send(command);
  } catch (error) {
    try {
      await prisma.asset.delete({ where: { id: asset.id } });
    } catch (rollbackError) {
      // Log rollback failure in a real app, but still throw the original error
    }
    throw new AppError('Failed to upload file to storage', 502);
  }

  return {
    message: 'File uploaded successfully',
    asset: {
      id: asset.id,
      filename: asset.filename,
      createdAt: asset.createdAt.toISOString(),
    },
  };
};

export const getAllAssets = async (): Promise<Asset[]> => {
  const assets = await prisma.asset.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return assets.map((asset) => ({
    id: asset.id,
    filename: asset.filename,
    createdAt: asset.createdAt.toISOString(),
  }));
};
