import { DirectoryNode } from "./src/core/type/directory";
import { ImageDetail, ImageIndex } from "./src/core/type/image";

interface WindowDirectoryAPI {
  openDialog(): Promise<string>;
  showDirectories(path: string): Promise<DirectoryNode[]>;
  listImageIndex(path: string): Promise<ImageIndex[]>;
  getImages(basePath: string, imageIndex: ImageIndex[]): Promise<ImageDetail[]>;
}

interface WindowAccessAPI {
  closeWindow(): Promise<void>;
  resizeWindow(): Promise<void>;
  minimizeWindow(): Promise<void>;
}

interface WindowStoreAPI {
  saveFavoritePrompt(favorite: FavoritePrompt): Promise<void>;
  getFavoritePrompt(): Promise<FavoritePrompt | null>;
  saveThumbnailSize(size: ThumbnailSize): Promise<void>;
  getThumbnailSize(): Promise<ThumbnailSize | null>;
}

declare global {
  interface Window {
    directoryAPI: WindowDirectoryAPI;
    windowAPI: WindowAccessAPI;
    storeAPI: WindowStoreAPI;
  }
}
