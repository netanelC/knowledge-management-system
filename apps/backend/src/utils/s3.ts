import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';
import config from 'config';

export const s3Client = new S3Client({
  region: config.get<string>('s3.region'),
  credentials: {
    accessKeyId: config.get<string>('s3.accessKeyId'),
    secretAccessKey: config.get<string>('s3.secretAccessKey'),
  },
  endpoint: config.get<string>('s3.endpoint'),
  forcePathStyle: config.get<boolean>('s3.forcePathStyle'),
});

export const bucketName = config.get<string>('s3.bucket');

export const pingS3 = async (): Promise<boolean> => {
  try {
    const command = new ListBucketsCommand({});
    await s3Client.send(command);
    return true;
  } catch (error) {
    return false;
  }
};
