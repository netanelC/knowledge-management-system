import { Request, Response, NextFunction } from 'express';
import { handleAssetUpload } from './model';

export const uploadAssetController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await handleAssetUpload(req.file);
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};
