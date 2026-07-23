import {
  createAssetInDb,
  createAssetMetadataInDb,
  uploadFileToS3,
  deleteAssetFromDb,
  getAllAssetsFromDb,
  getAssetS3Object as getS3ObjectDAL,
} from './DAL';
import type { CreateAssetInput } from './types';
import { AssetFormat, type Asset } from '../../types';
import { logger } from '../../utils/logger';
import { generateMetadataForAsset } from '../../utils/gemini';
import { ALLOWED_TEXT_EXTENSIONS, ALLOWED_IMAGE_EXTENSIONS } from 'types';

export const isValidAssetFile = (
  file: Express.Multer.File,
): { valid: boolean; type?: AssetFormat } => {
  if (file.mimetype.startsWith('text/')) return { valid: true, type: AssetFormat.TEXT };
  if (file.mimetype.startsWith('image/')) return { valid: true, type: AssetFormat.IMAGE };

  const isTextExt = ALLOWED_TEXT_EXTENSIONS.some((ext) =>
    file.originalname.toLowerCase().endsWith(ext),
  );
  const isImageExt = ALLOWED_IMAGE_EXTENSIONS.some((ext) =>
    file.originalname.toLowerCase().endsWith(ext),
  );

  if (isTextExt) return { valid: true, type: AssetFormat.TEXT };
  if (isImageExt) return { valid: true, type: AssetFormat.IMAGE };

  return { valid: false };
};

export const createAssetRecord = async (input: CreateAssetInput): Promise<Asset> => {
  const extractedText =
    input.type === AssetFormat.TEXT ? input.buffer.toString('utf-8') : undefined;

  // Database generates the ID and creates the record first
  const asset = await createAssetInDb({
    filename: input.filename,
    size: input.size,
    type: input.type,
    extractedText,
  });

  const generated = await generateMetadataForAsset(input.type, input.buffer, input.mimetype);

  let metadataRecord = null;
  if (generated) {
    try {
      metadataRecord = await createAssetMetadataInDb({
        assetId: asset.id,
        description: generated.description,
        keywords: generated.keywords,
      });
    } catch (error: unknown) {
      logger.error({ err: error, assetId: asset.id }, 'Failed to save asset metadata in database');
    }
  }

  try {
    // Attempt S3 upload with raw buffer
    await uploadFileToS3(asset.id, input.buffer, input.size, input.mimetype);
  } catch (error) {
    // If S3 fails, try to delete the stranded DB record
    try {
      await deleteAssetFromDb(asset.id);
    } catch (deleteError) {
      logger.error(
        { err: deleteError },
        `Failed to clean up stranded DB record for asset ${asset.id}`,
      );
    }
    throw error;
  }

  return {
    ...asset,
    metadata: metadataRecord,
  };
};

export const getAllAssets = async (): Promise<Asset[]> => {
  return getAllAssetsFromDb();
};

export const getAssetS3Object = async (id: string) => {
  return getS3ObjectDAL(id);
};
