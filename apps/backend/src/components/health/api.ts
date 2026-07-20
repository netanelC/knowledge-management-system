import { Router, Request, Response, NextFunction } from 'express';
import { HealthResponse } from 'types';
import { pingDatabase } from './service';
import { AppError } from '../../utils/error';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  try {
    const dbPingResult = await pingDatabase();

    const response: HealthResponse = {
      status: 'ok',
      database: 'connected',
      time: timestamp,
      dbPingResult,
    };
    res.json(response);
  } catch (_error) {
    const response: HealthResponse = {
      status: 'error',
      database: 'disconnected',
      time: timestamp,
    };
    res.status(503).json(response);
  }
});

export default router;
