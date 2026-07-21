import { pingDatabaseQuery } from './dal';

export const pingDatabase = async (): Promise<number | undefined> => {
  try {
    return await pingDatabaseQuery();
  } catch (error) {
    return undefined;
  }
};
