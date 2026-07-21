import { Router } from 'express';
import { healthCheckController } from './controller';

const router = Router();

router.get('/', healthCheckController);

export default router;
