export const isImageExtension = (filename: string): boolean => {
  const allowExtensions = ".(png|PNG)$";
  return !!filename.match(allowExtensions);
};
