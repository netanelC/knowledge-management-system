export type ISODateString = string;

export interface HealthResponse {
  status: 'ok' | 'error';
  database: 'connected' | 'disconnected';
}

export interface AssetUploadResponse {
  id: string;
  filename: string;
  size: number;
  createdAt: ISODateString;
}
