
import { prisma } from '../../utils/prisma';

export interface AssetRecord {
  id: string;
  filename: string;
  s3Key: string | null;
  createdAt: Date;
}

export interface CreateAssetInput {
  filename: string;
}

export const toAssetDTO = (asset: AssetRecord) => ({
  id: asset.id,
  filename: asset.filename,
  s3Key: asset.s3Key,
  createdAt: asset.createdAt.toISOString(),
});

export const createAssetRecord = async (
  input: CreateAssetInput,
) => {
  const asset = await prisma.asset.create({
    data: {
      filename: input.filename,
      s3Key: null,
    },
  });

  return toAssetDTO(asset);
};
