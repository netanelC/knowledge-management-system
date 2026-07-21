import { pingDatabaseQuery } from './dal';

export const pingDatabase = async (): Promise<number | undefined> => {
  return await pingDatabaseQuery();
};
