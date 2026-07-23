import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import multer from 'multer';
import { logger } from './utils/logger';
import { AppError } from './utils/error';
import healthRouter from './components/health/router';
import assetsRouter from './components/assets/router';
import config from 'config';

const app = express();
const port = config.get<number>('port');

app.use(cors());
app.use(express.json());
app.use(pinoHttp({ logger }));

app.use('/api/health', healthRouter);
app.use('/api/assets', assetsRouter);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(err);
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
  } else if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ error: 'File size exceeds maximum allowed limit (20MB)' });
    } else {
      res.status(400).json({ error: err.message });
    }
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

if (require.main === module) {
  app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
  });
}

export default app;
