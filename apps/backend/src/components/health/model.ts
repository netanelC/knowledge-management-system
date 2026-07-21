import { pingDatabaseQuery } from './DAL';

export const pingDatabase = async (): Promise<number | undefined> => {
  return await pingDatabaseQuery();
};
