const rawUrl = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/$/, '');

export const API_BASE =
  rawUrl && !rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')
    ? `https://${rawUrl}`
    : rawUrl;
