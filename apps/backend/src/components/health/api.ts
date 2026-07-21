import { Router, Request, Response, NextFunction } from 'express';
import { checkSystemHealth } from './service';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const { statusCode, response } = await checkSystemHealth();
  res.status(statusCode).json(response);
});

export default router;
