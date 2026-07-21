export type ISODateString = string;

export type HealthResponse = {
  status: 'ok' | 'error';
  database: 'connected' | 'disconnected';
};

export type AssetUploadResponse = {
  id: string;
  filename: string;
  size: number;
  createdAt: ISODateString;
};
