import { prisma } from '../../utils/prisma';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getS3Client, getS3Bucket } from '../../utils/s3';

export const createAssetInDb = async (filename: string, size: number) => {
  return await prisma.asset.create({
    data: {
      filename,
      size,
    },
  });
};

export const deleteAssetFromDb = async (id: string) => {
  return await prisma.asset.delete({
    where: { id },
  });
};

export const uploadFileToS3 = async (
  key: string,
  body: Buffer | import('stream').Readable,
  contentLength: number,
): Promise<void> => {
  const bucket = getS3Bucket();
  const client = getS3Client();

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentLength: contentLength,
  });

  await client.send(command);
};
