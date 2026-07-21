import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { handleAssetUpload, getAllAssets, getAssetFile } from './service';

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

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const assets = await getAllAssets();
    res.json(assets);
  } catch (error) {
    next(error);
  }
});

router.get('/:id/download', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { stream, contentType } = await getAssetFile(id);
    res.setHeader('Content-Type', contentType);
    stream.pipe(res);
  } catch (error) {
    next(error);
  }
});

export default router;
