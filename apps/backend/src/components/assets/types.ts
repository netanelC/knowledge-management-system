export interface AssetRecord {
  id: string;
  filename: string;
  size: number;
  createdAt: Date;
}

export interface CreateAssetInput {
  filename: string;
  size: number;
}
