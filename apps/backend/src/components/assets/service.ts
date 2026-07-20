import { AssetUploadResponse } from 'types';
import { AppError } from '../../utils/error';

export const handleAssetUpload = (file: Express.Multer.File | undefined): AssetUploadResponse => {
  if (!file) {
    throw new AppError('No file uploaded', 400);
  }

  return {
    message: 'File uploaded successfully',
    asset: {
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
    },
  };
};
