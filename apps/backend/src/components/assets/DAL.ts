import { prisma } from '../../utils/prisma';

export const createAssetInDb = async (id: string, filename: string, size: number) => {
  return await prisma.asset.create({
    data: {
      id,
      filename,
      size,
    },
  });
};
