import { Request, Response, NextFunction } from 'express';
import { HealthResponse } from 'types';
import { pingDatabase, pingStorage } from './model';
export const healthCheckController = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  let status: HealthResponse['status'] = 'ok';
  let database: HealthResponse['database'] = 'connected';
  let storage: HealthResponse['storage'] = 'connected';

  const dbIsHealthy = await pingDatabase();
  if (!dbIsHealthy) {
    status = 'error';
    database = 'disconnected';
  }

  const s3IsHealthy = await pingStorage();
  if (!s3IsHealthy) {
    status = 'error';
    storage = 'disconnected';
  }

  const response: HealthResponse = {
    status,
    database,
    storage,
  };

  res.status(status === 'ok' ? 200 : 503).json(response);
};
