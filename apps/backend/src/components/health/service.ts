import { prisma } from '../../utils/prisma';
import { pingS3 } from '../../utils/s3';
import { HealthResponse } from 'types';

export async function pingDatabase(): Promise<boolean> {
  try {
    // Using an explicit alias to avoid brittle implicit ?column? names
    const result = await prisma.$queryRaw<Array<{ value: number }>>`SELECT 1 as value`;
    return result?.[0]?.value === 1;
  } catch (error) {
    return false;
  }
}

export async function checkSystemHealth(): Promise<HealthResponse> {
  const timestamp = new Date().toISOString();

  const baseResponse: HealthResponse = {
    status: 'error',
    database: 'disconnected',
    s3: 'disconnected',
    time: timestamp,
  };

  try {
    const [dbConnected, s3Connected] = await Promise.all([pingDatabase(), pingS3()]);

    const isHealthy = s3Connected && dbConnected;

    return {
      ...baseResponse,
      status: isHealthy ? 'ok' : 'error',
      database: dbConnected ? 'connected' : 'disconnected',
      s3: s3Connected ? 'connected' : 'disconnected',
    };
  } catch (_error) {
    return baseResponse;
  }
}
