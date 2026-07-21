import { AssetUploadResponse } from 'types';
import { AppError } from '../../utils/error';
import { prisma } from '../../utils/prisma';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import config from 'config';
import { Readable } from 'stream';

export interface AssetUploadInput {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
}

const s3Client = new S3Client({
  region: config.get<string>('s3.region'),
  credentials: {
    accessKeyId: config.get<string>('s3.accessKeyId'),
    secretAccessKey: config.get<string>('s3.secretAccessKey'),
  },
});
const bucketName = config.get<string>('s3.bucket');

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
    });
    await s3Client.send(command);
  } catch (error) {
    await prisma.asset.delete({ where: { id: asset.id } });
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
