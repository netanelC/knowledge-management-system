import { Request, Response, NextFunction } from 'express';
import { createAssetRecord } from './model';
import { AppError } from '../../utils/error';

export const uploadAssetController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file;
    if (!file) {
      throw new AppError('No file uploaded', 400);
    }

    const isText = file.mimetype.startsWith('text/') || file.originalname.match(/\.(txt|md|csv)$/i);
    if (!isText) {
      throw new AppError('Invalid file type. Only text files are allowed.', 400);
    }

    const asset = await createAssetRecord({
      filename: file.originalname,
    });

    res.status(201).json({
      message: 'File uploaded successfully',
      asset,
    });
  } catch (error) {
    next(error);
  }
};
