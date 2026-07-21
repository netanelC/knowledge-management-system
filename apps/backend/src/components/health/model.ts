import { pingDatabaseQuery } from './DAL';
import { pingStorage as s3Ping } from '../assets/storage';

export const pingDatabase = async (): Promise<number | undefined> => {
  return await pingDatabaseQuery();
};

export const pingStorage = async (): Promise<boolean> => {
  return await s3Ping();
};
