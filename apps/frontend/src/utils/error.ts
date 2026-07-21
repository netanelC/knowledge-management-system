export const getErrorMessage = (
  err: unknown,
  defaultMessage: string = 'An error occurred',
): string => {
  return err instanceof Error ? err.message : defaultMessage;
};
