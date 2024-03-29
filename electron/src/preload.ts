import { ipcRenderer, contextBridge } from "electron";
import { DirectoryNode } from "./type/directory";
import {
  ImageDetail,
  ImageIndex,
  ImageLocation,
  ThumbnailSize,
} from "./type/image";
import { FavoritePrompt } from "./type/favorite";
import { Sort } from "./type/sort";
import { getSortSettings } from "./logic/store";

window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector: any, text: any) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ["chrome", "node", "electron"]) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});

// contextBridgeを使用してレンダラープロセスにAPIとして公開する
contextBridge.exposeInMainWorld("directoryAPI", {
  openDialog: () => ipcRenderer.invoke("open-directory-dialog"),
  showDirectories: (path: string): Promise<DirectoryNode[]> => {
    // このへんもうちょい上手く書きたい
    const res = ipcRenderer.invoke("get-directory-nodes", path);
    return res as Promise<DirectoryNode[]>;
  },
  listImageIndex: (path: string): Promise<ImageIndex[]> => {
    const res = ipcRenderer.invoke("list-image-index", path);
    return res as Promise<ImageIndex[]>;
  },
  getImages: (
    basePath: string,
    imageIndex: ImageIndex[]
  ): Promise<ImageDetail[]> => {
    const res = ipcRenderer.invoke("get-images", basePath, imageIndex);
    return res as Promise<ImageDetail[]>;
  },
  getImageDataUrl: (path: string): Promise<string> => {
    const res = ipcRenderer.invoke("get-image-dataurl", path);
    return res as Promise<string>;
  },
  copyImages: (
    files: ImageLocation[],
    destinationFolderPath: string
  ): Promise<ImageLocation[]> => {
    const res = ipcRenderer.invoke("copy-images", files, destinationFolderPath);
    return res as Promise<ImageLocation[]>;
  },
  forceCopyImages: (
    files: ImageLocation[],
    destinationFolderPath: string
  ): Promise<void> => {
    const res = ipcRenderer.invoke(
      "force-copy-images",
      files,
      destinationFolderPath
    );
    return res as Promise<void>;
  },
});

contextBridge.exposeInMainWorld("windowAPI", {
  closeWindow: () => ipcRenderer.invoke("close-window"),
  resizeWindow: () => ipcRenderer.invoke("resize-window"),
  minimizeWindow: () => ipcRenderer.invoke("minimize-window"),
  showChildWindow: (url: string) =>
    ipcRenderer.invoke("show-child-window", url),
});

contextBridge.exposeInMainWorld("storeAPI", {
  saveFavoritePrompt: (favorite: FavoritePrompt) =>
    ipcRenderer.invoke("save-favorite-prompt", favorite),
  getFavoritePrompt: (): Promise<FavoritePrompt | null> => {
    const res = ipcRenderer.invoke("get-favorite-prompt");
    return res as Promise<FavoritePrompt | null>;
  },
  saveThumbnailSize: (size: ThumbnailSize) =>
    ipcRenderer.invoke("save-thumbnail-size", size),
  getThumbnailSize: (): Promise<ThumbnailSize | null> => {
    const res = ipcRenderer.invoke("get-thumbnail-size");
    return res as Promise<ThumbnailSize | null>;
  },
  saveSortSettings: (sort: Sort) =>
    ipcRenderer.invoke("save-sort-settings", sort),
  getSortSettings: (): Promise<Sort | null> => {
    const res = ipcRenderer.invoke("get-sort-settings");
    return res as Promise<Sort | null>;
  },
});
