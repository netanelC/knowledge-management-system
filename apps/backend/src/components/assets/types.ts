import type { AssetFormat } from '@prisma/client';

export type CreateAssetInput = {
  filename: string;
  size: number;
  buffer: Buffer;
  type: AssetFormat;
  mimetype: string;
};
