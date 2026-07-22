import { prisma } from '../../utils/prisma';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getS3Client, getS3Bucket } from '../../utils/s3';
import type { AssetFormat } from '@prisma/client';

export type CreateAssetDbInput = {
  filename: string;
  size: number;
  type: AssetFormat;
  extractedText?: string;
};

export const createAssetInDb = async (data: CreateAssetDbInput) => {
  return await prisma.asset.create({
    data,
  });
};

export const getAllAssetsFromDb = async () => {
  return await prisma.asset.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

export const deleteAssetFromDb = async (id: string) => {
  return await prisma.asset.delete({
    where: { id },
  });
};

export const uploadFileToS3 = async (
  key: string,
  body: Buffer | import('stream').Readable,
  contentLength: number,
  contentType: string,
): Promise<void> => {
  const bucket = getS3Bucket();
  const client = getS3Client();

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentLength: contentLength,
    ContentType: contentType,
  });

  await client.send(command);
};

export const getAssetS3Object = async (key: string) => {
  const bucket = getS3Bucket();
  const client = getS3Client();

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return await client.send(command);
};
