import { prisma } from '../../utils/prisma';

export async function pingDatabase(): Promise<number | undefined> {
  // Using an explicit alias to avoid brittle implicit ?column? names
  const result = await prisma.$queryRaw<Array<{ value: number }>>`SELECT 1 as value`;
  return result?.[0]?.value;
}
