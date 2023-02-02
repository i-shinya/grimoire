import { ipcRenderer, contextBridge } from "electron";
import { DirectoryNode } from "../core/type/directory";
import { ImageDetail } from "../core/type/image";

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
contextBridge.exposeInMainWorld("direcrotyAPI", {
  openDialog: () => ipcRenderer.invoke("open-direcroty-dialog"),
  showDirectories: (path: string): Promise<DirectoryNode[]> => {
    // このへんもうちょい上手く書きたい
    const res = ipcRenderer.invoke("get-direcroty-nodes", path);
    return res as Promise<DirectoryNode[]>;
  },
  getImages: (path: string): Promise<ImageDetail[]> => {
    const res = ipcRenderer.invoke("get-images", path);
    return res as Promise<ImageDetail[]>;
  },
});
