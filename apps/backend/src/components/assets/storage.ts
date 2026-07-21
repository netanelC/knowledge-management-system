import { S3Client, PutObjectCommand, HeadBucketCommand } from '@aws-sdk/client-s3';
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
      endpoint: config.has('aws.s3.endpoint') ? config.get<string>('aws.s3.endpoint') : undefined,
      forcePathStyle: config.has('aws.s3.forcePathStyle')
        ? config.get<boolean>('aws.s3.forcePathStyle')
        : false,
    });
  }
  return s3Client;
};

export const uploadFile = async (
  key: string,
  body: Buffer | Readable,
  contentLength?: number,
): Promise<void> => {
  const bucket = config.get<string>('aws.s3.bucket');
  const client = getS3Client();

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ...(contentLength !== undefined ? { ContentLength: contentLength } : {}),
  });

  await client.send(command);
};

export const pingStorage = async (): Promise<boolean> => {
  try {
    const bucket = config.get<string>('aws.s3.bucket');
    const client = getS3Client();
    await client.send(new HeadBucketCommand({ Bucket: bucket }));
    return true;
  } catch (_error) {
    return false;
  }
};
