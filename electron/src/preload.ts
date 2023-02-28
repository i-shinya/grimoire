import { ipcRenderer, contextBridge } from "electron";
import { DirectoryNode } from "./type/directory";
import { ImageDetail, ImageIndex, ThumbnailSize } from "./type/image";
import { FavoritePrompt } from "./type/favorite";

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
});

contextBridge.exposeInMainWorld("windowAPI", {
  closeWindow: () => ipcRenderer.invoke("close-window"),
  resizeWindow: () => ipcRenderer.invoke("resize-window"),
  minimizeWindow: () => ipcRenderer.invoke("minimize-window"),
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
});
