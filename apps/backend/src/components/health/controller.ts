import { Request, Response, NextFunction } from 'express';
import { HealthResponse } from 'types';
import { pingDatabase } from './model';

export const healthCheckController = async (req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  let status: HealthResponse['status'] = 'ok';
  let database: HealthResponse['database'] = 'connected';
  let dbPingResult;

  try {
    dbPingResult = await pingDatabase();
  } catch (_error) {
    status = 'error';
    database = 'disconnected';
  }

  const response: HealthResponse = {
    status,
    database,
    time: timestamp,
    ...(dbPingResult ? { dbPingResult } : {}),
  };

  res.status(status === 'ok' ? 200 : 503).json(response);
};
