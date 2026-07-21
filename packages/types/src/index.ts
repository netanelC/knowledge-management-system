export type ISODateString = string;

export interface HealthResponse {
  status: 'ok' | 'error';
  database: 'connected' | 'disconnected';
  s3: 'connected' | 'disconnected';
  time: ISODateString;
}

export interface Asset {
  id: string;
  filename: string;
  type: 'DOCUMENT' | 'IMAGE';
  createdAt: ISODateString;
}

export interface AssetUploadResponse {
  message: string;
  asset: Asset;
}
