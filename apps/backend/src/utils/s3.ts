import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import config from 'config';

let s3Client: S3Client | null = null;

export const getS3Client = () => {
  if (!s3Client) {
    const s3Config: S3ClientConfig = {
      region: config.has('aws.s3.region') ? config.get<string>('aws.s3.region') : 'us-east-1',
    };

    if (config.has('aws.s3.endpoint')) {
      s3Config.endpoint = config.get<string>('aws.s3.endpoint');
    }

    if (config.has('aws.s3.forcePathStyle')) {
      s3Config.forcePathStyle = config.get<boolean>('aws.s3.forcePathStyle');
    }

    if (config.has('aws.s3.accessKeyId') && config.has('aws.s3.secretAccessKey')) {
      s3Config.credentials = {
        accessKeyId: config.get<string>('aws.s3.accessKeyId'),
        secretAccessKey: config.get<string>('aws.s3.secretAccessKey'),
      };
    }

    s3Client = new S3Client(s3Config);
  }
  return s3Client;
};

export const getS3Bucket = (): string => {
  return config.get<string>('aws.s3.bucket');
};
