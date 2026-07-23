import { prisma } from '../../utils/prisma';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getS3Client, getS3Bucket } from '../../utils/s3';
import type { AssetFormat, AssetMetadata } from '@prisma/client';
import type { Readable } from 'stream';
import type { Asset } from '../../types';

export type CreateAssetDbInput = {
  filename: string;
  size: number;
  type: AssetFormat;
  extractedText?: string;
};

export const createAssetInDb = async (data: CreateAssetDbInput) => {
  return await prisma.asset.create({
    data,
    include: { metadata: true },
  });
};

export const createAssetMetadataInDb = async (data: AssetMetadata) => {
  return await prisma.assetMetadata.create({
    data,
  });
};

const searchFilters = (query: string) => ({
  contains: query,
  mode: 'insensitive' as const,
});

export const getAllAssetsFromDb = async (query?: string): Promise<Asset[]> => {
  const search = query?.trim();

  const where = search
    ? {
        OR: [
          { filename: searchFilters(search) },
          { extractedText: searchFilters(search) },
          { metadata: { description: searchFilters(search) } },
          { metadata: { keywords: searchFilters(search) } },
        ],
      }
    : undefined;

  return await prisma.asset.findMany({
    where,
    include: { metadata: true },
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
  body: Buffer | Readable,
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
