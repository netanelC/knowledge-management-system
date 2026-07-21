export const isValidTextFile = (mimetype: string, originalname: string): boolean => {
  return mimetype.startsWith('text/') || !!originalname.match(/\.(txt|md|csv)$/i);
};
