import { createAssetInDb } from './DAL';
import { AssetUploadResponse } from 'types';

export interface AssetRecord {
  id: string;
  filename: string;
  size: number;
  createdAt: Date;
}

export interface CreateAssetInput {
  filename: string;
  size: number;
}

export const toAssetDTO = (asset: AssetRecord): AssetUploadResponse => ({
  id: asset.id,
  filename: asset.filename,
  size: asset.size,
  createdAt: asset.createdAt.toISOString(),
});

export const isValidTextFile = (file: Express.Multer.File): boolean => {
  return file.mimetype.startsWith('text/') || !!file.originalname.match(/\.(txt|md|csv)$/i);
};

export const createAssetRecord = async (input: CreateAssetInput) => {
  const asset = await createAssetInDb(input.filename, input.size);

  return toAssetDTO(asset);
};
