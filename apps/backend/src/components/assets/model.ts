import { AssetUploadResponse } from 'types';
import { AppError } from '../../utils/error';
import { prisma } from '../../utils/prisma';

export interface AssetUploadInput {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
}

const toAssetDTO = (asset: { id: string; filename: string; s3Key: string | null; createdAt: Date }) => ({
  id: asset.id,
  filename: asset.filename,
  s3Key: asset.s3Key,
  createdAt: asset.createdAt.toISOString(),
});

const validateTextFile = (file: AssetUploadInput) => {
  const isText = file.mimetype.startsWith('text/') || file.originalname.match(/\.(txt|md|csv)$/i);
  if (!isText) {
    throw new AppError('Invalid file type. Only text files are allowed.', 400);
  }
};

export const handleAssetUpload = async (
  file: AssetUploadInput | undefined,
): Promise<AssetUploadResponse> => {
  if (!file) {
    throw new AppError('No file uploaded', 400);
  }

  validateTextFile(file);

  const asset = await prisma.asset.create({
    data: {
      filename: file.originalname,
      s3Key: null,
    },
  });

  return {
    message: 'File uploaded successfully',
    asset: toAssetDTO(asset),
  };
};
