import { AssetUploadResponse } from 'types';
import { AppError } from '../../utils/error';
import { prisma } from '../../utils/prisma';
import { randomUUID } from 'crypto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import config from 'config';

export interface AssetUploadInput {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
}

const s3Client = new S3Client({
  region: config.get<string>('aws.s3.region'),
  credentials: {
    accessKeyId: config.get<string>('aws.s3.accessKeyId') || 'test-key',
    secretAccessKey: config.get<string>('aws.s3.secretAccessKey') || 'test-secret',
  },
});
const bucketName = config.get<string>('aws.s3.bucket');

const validateTextFile = (file: AssetUploadInput) => {
  const isText = file.mimetype.startsWith('text/') || file.originalname.match(/\.(txt|md|csv)$/i);
  if (!isText) {
    throw new AppError('Invalid file type. Only text files are allowed.', 400);
  }
};

const uploadToS3 = async (key: string, buffer: Buffer, mimetype: string) => {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: mimetype,
  });
  await s3Client.send(command);
};

export const handleAssetUpload = async (
  file: AssetUploadInput | undefined,
): Promise<AssetUploadResponse> => {
  if (!file) {
    throw new AppError('No file uploaded', 400);
  }

  validateTextFile(file);

  const assetId = randomUUID();

  try {
    await uploadToS3(assetId, file.buffer, file.mimetype);
  } catch (error) {
    throw new AppError('Failed to upload file to storage', 502);
  }

  const asset = await prisma.asset.create({
    data: {
      id: assetId,
      filename: file.originalname,
      s3Key: assetId,
    },
  });

  return {
    message: 'File uploaded successfully',
    asset: {
      id: asset.id,
      filename: asset.filename,
      s3Key: asset.s3Key,
      createdAt: asset.createdAt.toISOString(),
    },
  };
};
