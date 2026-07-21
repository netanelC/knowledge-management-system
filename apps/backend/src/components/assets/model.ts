import { createAssetInDb } from './DAL';
import { AssetUploadResponse } from 'types';
import { CreateAssetInput } from './types';
import { Asset } from '@prisma/client';

const toAssetDTO = (asset: Asset): AssetUploadResponse => ({
  id: asset.id,
  filename: asset.filename,
  size: asset.size,
  createdAt: asset.createdAt.toISOString(),
});

export const isValidTextFile = (file: Express.Multer.File): boolean => {
  return file.mimetype.startsWith('text/') || !!file.originalname.match(/\.(txt|md|csv)$/i);
};

export const createAssetRecord = async (input: CreateAssetInput): Promise<AssetUploadResponse> => {
  const asset = await createAssetInDb(input.filename, input.size);

  return toAssetDTO(asset);
};
