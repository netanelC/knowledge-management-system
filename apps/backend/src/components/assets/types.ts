export type AssetRecord = {
  id: string;
  filename: string;
  size: number;
  createdAt: Date;
};

export type CreateAssetInput = {
  filename: string;
  size: number;
};
