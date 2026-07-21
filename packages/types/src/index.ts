export type ISODateString = string;

export interface HealthResponse {
  status: 'ok' | 'error';
  database: 'connected' | 'disconnected';
  time: ISODateString;
  dbPingResult?: number;
}

export interface Asset {
  id: string;
  filename: string;
  createdAt: ISODateString;
}

export interface AssetUploadResponse {
  message: string;
  asset: Asset;
}
