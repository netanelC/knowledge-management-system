import type { Asset as PrismaAsset } from '@prisma/client';

export type ISODateString = string;

// Utility to recursively stringify dates (matching JSON serialization over network)
export type Serialize<T> = {
  [K in keyof T]: T[K] extends Date ? ISODateString : T[K];
};

export type Asset = Serialize<PrismaAsset>;
