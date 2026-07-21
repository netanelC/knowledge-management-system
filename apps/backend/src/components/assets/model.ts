import { createAssetInDb } from './DAL';
import { CreateAssetInput } from './types';
import type { Asset } from '@prisma/client';
import { uploadFile } from './storage';
import { Readable } from 'stream';
import crypto from 'crypto';

export const isValidTextFile = (file: Express.Multer.File): boolean => {
  return file.mimetype.startsWith('text/') || !!file.originalname.match(/\.(txt|md|csv)$/i);
};

export const createAssetRecord = async (input: CreateAssetInput): Promise<Asset> => {
  const id = crypto.randomUUID();
  const fileStream = Readable.from(input.buffer);

  // Upload to S3 first to ensure we don't strand DB records on failure
  await uploadFile(id, fileStream, input.size);

  // Once S3 upload succeeds, create the database record
  return await createAssetInDb(id, input.filename, input.size);
};
