export type ISODateString = string;

export type HealthResponse = {
  status: 'ok' | 'error';
  database: 'connected' | 'disconnected';
  storage: 'connected' | 'disconnected';
};

export const ALLOWED_TEXT_EXTENSIONS = ['.txt', '.md', '.csv'];
export const ALLOWED_IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];
export const ALLOWED_ALL_EXTENSIONS = [...ALLOWED_TEXT_EXTENSIONS, ...ALLOWED_IMAGE_EXTENSIONS];

export const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};
