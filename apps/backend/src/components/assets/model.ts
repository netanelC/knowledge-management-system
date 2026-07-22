import {
  createAssetInDb,
  createAssetMetadataInDb,
  uploadFileToS3,
  deleteAssetFromDb,
  getAllAssetsFromDb,
  getAssetS3Object as getS3ObjectDAL,
} from './DAL';
import { CreateAssetInput } from './types';
import { Asset, AssetFormat } from '../../types';
import { logger } from '../../utils/logger';
import { generateDocumentMetadata } from '../../utils/gemini';
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

  let metadataRecord = null;
  if (extractedText && extractedText.trim().length > 0) {
    try {
      const generated = await generateDocumentMetadata(extractedText);
      if (generated) {
        metadataRecord = await createAssetMetadataInDb({
          assetId: asset.id,
          description: generated.description,
          keywords: generated.keywords,
        });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error(
        { error: message, assetId: asset.id },
        'Failed to generate metadata for document asset',
      );
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
        { error: deleteError },
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
  return await getAllAssetsFromDb();
};

export const getAssetS3Object = async (id: string) => {
  return await getS3ObjectDAL(id);
};
