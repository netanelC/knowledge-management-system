import { createAssetInDb } from './dal';

export interface AssetRecord {
  id: string;
  filename: string;
  s3Key: string | null;
  size: number;
  createdAt: Date;
}

export interface CreateAssetInput {
  filename: string;
  size: number;
}

export const toAssetDTO = (asset: AssetRecord) => ({
  id: asset.id,
  filename: asset.filename,
  s3Key: asset.s3Key,
  size: asset.size,
  createdAt: asset.createdAt.toISOString(),
});

export const createAssetRecord = async (input: CreateAssetInput) => {
  const asset = await createAssetInDb(input.filename, input.size);

  return toAssetDTO(asset);
};
