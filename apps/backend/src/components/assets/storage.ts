import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import config from 'config';

let s3Client: S3Client | null = null;

const getS3Client = () => {
  if (!s3Client) {
    s3Client = new S3Client({
      region: config.get<string>('aws.s3.region'),
      credentials: {
        accessKeyId: config.get<string>('aws.s3.accessKeyId'),
        secretAccessKey: config.get<string>('aws.s3.secretAccessKey'),
      },
    });
  }
  return s3Client;
};

export const uploadFile = async (key: string, body: Buffer | Readable): Promise<void> => {
  const bucket = config.get<string>('aws.s3.bucket');
  const client = getS3Client();

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
  });

  await client.send(command);
};
