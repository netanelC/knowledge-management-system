import { Request, Response, NextFunction } from 'express';
import { createAssetRecord } from './model';
import { isValidTextFile } from './utils';
import { AppError } from '../../utils/error';

export const uploadAssetController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file;
    if (!file) {
      throw new AppError('No file uploaded', 400);
    }

    const isText = isValidTextFile(file.mimetype, file.originalname);
    if (!isText) {
      throw new AppError('Invalid file type. Only text files are allowed.', 400);
    }

    const asset = await createAssetRecord({
      filename: file.originalname,
      size: file.size,
    });

    res.status(201).json(asset);
  } catch (error) {
    next(error);
  }
};
