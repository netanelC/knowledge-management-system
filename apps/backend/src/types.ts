import type { Prisma, AssetMetadata } from '@prisma/client';

export { AssetFormat, type AssetMetadata } from '@prisma/client';

export type Asset = Prisma.AssetGetPayload<{ include: { metadata: true } }>;

export type GeneratedMetadata = Pick<AssetMetadata, 'description' | 'keywords'>;
