import { createAssetInDb, uploadFileToS3, deleteAssetFromDb, getAllAssetsFromDb } from './DAL';
import { CreateAssetInput } from './types';
import type { Asset } from '@prisma/client';
import { logger } from '../../utils/logger';
import { Readable } from 'stream';

export const createAssetRecord = async (input: CreateAssetInput): Promise<Asset> => {
  // Database generates the ID and creates the record first
  const asset = await createAssetInDb(input.filename, input.size);
  const fileStream = Readable.from(input.buffer);

  try {
    // Attempt S3 upload with raw buffer
    await uploadFileToS3(asset.id, fileStream, input.size);
  } catch (error) {
    // If S3 fails, try to delete the stranded DB record
    try {
      await deleteAssetFromDb(asset.id);
    } catch (deleteError) {
      logger.error(
        { error: deleteError },
        `Failed to clean up stranded DB record for asset ${asset.id}`,
      );
    }
    throw error;
  }

  return asset;
};

export const getAllAssets = async (): Promise<Asset[]> => {
  return await getAllAssetsFromDb();
};
