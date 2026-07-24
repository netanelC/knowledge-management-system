import { prisma } from '../../utils/prisma';
import { HeadBucketCommand, CreateBucketCommand } from '@aws-sdk/client-s3';
import { getS3Client, getS3Bucket } from '../../utils/s3';

export const isDatabaseHealthy = async (): Promise<boolean> => {
  try {
    const result = await prisma.$queryRaw<Array<{ value: number }>>`SELECT 1 as value`;
    return result[0]?.value === 1;
  } catch (_error) {
    return false;
  }
};

export const isStorageHealthy = async (): Promise<boolean> => {
  try {
    const bucket = getS3Bucket();
    const client = getS3Client();
    try {
      await client.send(new HeadBucketCommand({ Bucket: bucket }));
    } catch (_err) {
      await client.send(new CreateBucketCommand({ Bucket: bucket }));
    }
    return true;
  } catch (_error) {
    return false;
  }
};
