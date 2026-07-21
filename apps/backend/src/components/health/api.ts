import { Router, Request, Response, NextFunction } from 'express';
import { checkSystemHealth } from './service';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await checkSystemHealth();
    const statusCode = response.status === 'ok' ? 200 : 503;
    res.status(statusCode).json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
