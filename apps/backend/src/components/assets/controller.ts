import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/error';
import { createAssetRecord, isValidTextFile } from './model';

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

    try {
      const asset = await createAssetRecord({
        filename: file.originalname,
        size: file.size,
        buffer: file.buffer,
      });

      res.status(201).json(asset);
    } catch (error) {
      throw new AppError(`Failed to upload asset: ${String(error)}`, 500);
    }
  } catch (error) {
    next(error);
  }
};
