import { createAssetInDb } from './DAL';
import { CreateAssetInput } from './types';
import type { Asset } from '@prisma/client';

export const isValidTextFile = (file: Express.Multer.File): boolean => {
  return file.mimetype.startsWith('text/') || !!file.originalname.match(/\.(txt|md|csv)$/i);
};

export const createAssetRecord = async (input: CreateAssetInput): Promise<Asset> => {
  return await createAssetInDb(input.filename, input.size);
};
