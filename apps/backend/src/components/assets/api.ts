import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { handleAssetUpload } from './service';

const router = Router();

// Configure multer for in-memory storage (limit file size to 5MB to prevent OOM)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/', upload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await handleAssetUpload(req.file);
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
