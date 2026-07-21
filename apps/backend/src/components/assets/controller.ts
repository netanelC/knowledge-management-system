import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/error';
import { createAssetRecord, getAllAssets } from './model';

export const isValidTextFile = (file: Express.Multer.File): boolean => {
  return file.mimetype.startsWith('text/') || !!file.originalname.match(/\.(txt|md|csv)$/i);
};

export const uploadAssetController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file;
    if (!file) {
      throw new AppError('No file uploaded', 400);
    }

    const isText = isValidTextFile(file);
    if (!isText) {
      throw new AppError('Invalid file type. Only text files are allowed.', 400);
    }

    const asset = await createAssetRecord({
      filename: file.originalname,
      size: file.size,
      buffer: file.buffer,
    });

    res.status(201).json(asset);
  } catch (error) {
    next(error);
  }
};

export const getAllAssetsController = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const assets = await getAllAssets();
    res.status(200).json({ assets });
  } catch (error) {
    next(error);
  }
};
