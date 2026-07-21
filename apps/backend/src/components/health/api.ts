import { Router, Request, Response, NextFunction } from 'express';
import { HealthResponse } from 'types';
import { pingDatabase } from './service';
import { pingS3 } from '../../utils/s3';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
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

    res.status(isHealthy ? 200 : 503).json(response);
  } catch (_error) {
    const response: HealthResponse = {
      status: 'error',
      database: 'disconnected',
      s3: 'disconnected',
      time: timestamp,
    };
    res.status(503).json(response);
  }
});

export default router;
