import { ipcRenderer } from "electron";

window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector: any, text: any) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ["chrome", "node", "electron"]) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});

// FIXME openDialogの型定義を上手く読み込めないのでanyにしているが修正したい
(window as any).openDialog = (): Promise<string> => {
  return ipcRenderer.invoke("open-direcroty-dialog");
};
