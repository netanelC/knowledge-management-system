import { prisma } from '../../utils/prisma';

export const pingDatabaseQuery = async (): Promise<number | undefined> => {
  const result = await prisma.$queryRaw<Array<{ value: number }>>`SELECT 1 as value`;
  return result?.[0]?.value;
};
