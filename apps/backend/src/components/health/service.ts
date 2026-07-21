import { prisma } from '../../utils/prisma';
import { pingS3 } from '../../utils/s3';
import { HealthResponse } from 'types';

export async function pingDatabase(): Promise<number | undefined> {
  // Using an explicit alias to avoid brittle implicit ?column? names
  const result = await prisma.$queryRaw<Array<{ value: number }>>`SELECT 1 as value`;
  return result?.[0]?.value;
}

export async function checkSystemHealth(): Promise<{
  statusCode: number;
  response: HealthResponse;
}> {
  const timestamp = new Date().toISOString();
  try {
    const [dbPingResult, s3Connected] = await Promise.all([pingDatabase(), pingS3()]);

    const isHealthy = s3Connected && dbPingResult !== undefined;

    const response: HealthResponse = {
      status: isHealthy ? 'ok' : 'error',
      database: dbPingResult !== undefined ? 'connected' : 'disconnected',
      s3: s3Connected ? 'connected' : 'disconnected',
      time: timestamp,
      dbPingResult,
    };

    return { statusCode: isHealthy ? 200 : 503, response };
  } catch (_error) {
    const response: HealthResponse = {
      status: 'error',
      database: 'disconnected',
      s3: 'disconnected',
      time: timestamp,
    };
    return { statusCode: 503, response };
  }
}
