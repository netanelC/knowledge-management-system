export type ISODateString = string;

export interface HealthResponse {
  status: 'ok' | 'error';
  database: 'connected' | 'disconnected';
  time: ISODateString;
  dbPingResult?: number;
}

export interface AssetUploadResponse {
  message: string;
  asset: {
    id: string;
    filename: string;
    s3Key: string | null;
    createdAt: ISODateString;
  };
}
