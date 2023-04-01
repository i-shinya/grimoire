import { DirectoryNode } from "./src/core/type/directory";
import { ImageDetail, ImageIndex } from "./src/core/type/image";
import { Sort } from "./src/core/type/listing";

interface WindowDirectoryAPI {
  openDialog(): Promise<string>;
  showDirectories(path: string): Promise<DirectoryNode[]>;
  listImageIndex(path: string): Promise<ImageIndex[]>;
  getImages(basePath: string, imageIndex: ImageIndex[]): Promise<ImageDetail[]>;
  getImageDataUrl(path: string): Promise<string>;
  copyImages(
    files: ImageLocation[],
    destinationFolderPath: string
  ): Promise<ImageLocation[]>;
  forceCopyImages(
    files: ImageLocation[],
    destinationFolderPath: string
  ): Promise<void>;
}

interface WindowAccessAPI {
  closeWindow(): Promise<void>;
  resizeWindow(): Promise<void>;
  minimizeWindow(): Promise<void>;
  showChildWindow(url: string): Promise<void>;
}

interface WindowStoreAPI {
  saveFavoritePrompt(favorite: FavoritePrompt): Promise<void>;
  getFavoritePrompt(): Promise<FavoritePrompt | null>;
  saveThumbnailSize(size: ThumbnailSize): Promise<void>;
  getThumbnailSize(): Promise<ThumbnailSize | null>;
  saveSortSettings(sort: Sort): Promise<void>;
  getSortSettings(): Promise<Sort | null>;
}

declare global {
  interface Window {
    directoryAPI: WindowDirectoryAPI;
    windowAPI: WindowAccessAPI;
    storeAPI: WindowStoreAPI;
  }
}
