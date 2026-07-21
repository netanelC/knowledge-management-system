export type ISODateString = string;

export type HealthResponse = {
  status: 'ok' | 'error';
  database: 'connected' | 'disconnected';
};
