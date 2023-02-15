import { DirectoryNode } from "./src/core/type/directory";
import { ImageDetail } from "./src/core/type/image";

interface WindowDirectoryAPI {
  openDialog: () => Promise<string>;
  showDirectories(path: string): Promise<DirectoryNode[]>;
  getImages(path: string): Promise<ImageDetail[]>;
}

interface WindowAccessAPI {
  closeWindow(): Promise<void>;
  resizeWindow(): Promise<void>;
  minimizeWindow(): Promise<void>;
}

declare global {
  interface Window {
    directoryAPI: WindowDirectoryAPI;
    windowAPI: WindowAccessAPI;
  }
}
