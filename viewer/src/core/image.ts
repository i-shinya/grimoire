export const isImageExtension = (filename: string): boolean => {
  const allowExtensions = ".(jpeg|jpg|png|bmp|gif|JPEG|JPG|PNG|BMP|GIF)$";
  return !!filename.match(allowExtensions);
};
