import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { uploadAssetController } from './controller';

const router = Router();

// Configure multer for in-memory storage (limit file size to 5MB to prevent OOM)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/', upload.single('file'), uploadAssetController);

export default router;
