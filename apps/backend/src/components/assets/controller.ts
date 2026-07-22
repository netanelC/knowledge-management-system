import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/error';
import { createAssetRecord, getAllAssets, getAssetS3Object, isValidAssetFile } from './model';

export const uploadAssetController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw new AppError('No file uploaded', 400);
    }

    const validation = isValidAssetFile(req.file);
    if (!validation.valid || !validation.type) {
      throw new AppError('Invalid file type', 400);
    }

    const asset = await createAssetRecord({
      filename: req.file.originalname,
      size: req.file.size,
      buffer: req.file.buffer,
      type: validation.type,
      mimetype: req.file.mimetype,
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

export const getAssetContentController = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const s3Object = await getAssetS3Object(id);

    if (!s3Object.Body) {
      throw new AppError('Asset content not found in S3', 404);
    }

    if (s3Object.ContentType) {
      res.setHeader('Content-Type', s3Object.ContentType);
    }
    if (s3Object.ContentLength) {
      res.setHeader('Content-Length', s3Object.ContentLength);
    }

    // Body is a Readable stream in Node.js when using the AWS SDK
    (s3Object.Body as NodeJS.ReadableStream).pipe(res);
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'NoSuchKey') {
      next(new AppError('Asset not found', 404));
    } else {
      next(error);
    }
  }
};
