export type ISODateString = string;

export interface HealthResponse {
  status: 'ok' | 'error';
  database: 'connected' | 'disconnected';
  time: ISODateString;
  dbPingResult?: number;
}
