export const isImageExtension = (filename: string): boolean => {
  const allowExtensions = ".(jpeg|jpg|png|JPEG|JPG|PNG)$";
  return !!filename.match(allowExtensions);
};
