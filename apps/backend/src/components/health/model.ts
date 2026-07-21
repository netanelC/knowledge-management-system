import { isDatabaseHealthy as isDbHealthy, isStorageHealthy as isStoreHealthy } from './DAL';

export const pingDatabase = async (): Promise<boolean> => {
  return await isDbHealthy();
};

export const pingStorage = async (): Promise<boolean> => {
  return await isStoreHealthy();
};
