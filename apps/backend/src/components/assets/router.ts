import { Router } from 'express';
import multer from 'multer';
import config from 'config';
import {
  uploadAssetController,
  getAllAssetsController,
  getAssetContentController,
} from './controller';

const router = Router();

const maxFileSize = config.get<number>('assets.maxFileSize');

// Configure multer for in-memory storage (limit file size from config to prevent OOM)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxFileSize },
});

router.post('/', upload.single('file'), uploadAssetController);
router.get('/', getAllAssetsController);
router.get('/:id/content', getAssetContentController);

export default router;
