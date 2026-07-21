import { prisma } from '../../utils/prisma';

export const createAssetInDb = async (filename: string, size: number, s3Key: string | null = null) => {
  return await prisma.asset.create({
    data: {
      filename,
      size,
      s3Key,
    },
  });
};
