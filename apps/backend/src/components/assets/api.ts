import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { handleAssetUpload } from './service';

const router = Router();

// Configure multer for in-memory storage
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = handleAssetUpload(req.file);
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
