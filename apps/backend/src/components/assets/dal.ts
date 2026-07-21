import { prisma } from '../../utils/prisma';

export const createAssetInDb = async (filename: string, size: number) => {
  return await prisma.asset.create({
    data: {
      filename,
      size,
    },
  });
};
