import { BrowserWindow, BrowserView } from "electron";

// windowを閉じる
export const closeWindow = (window: BrowserWindow) => {
  window.close();
};

// window最大化
export const maximizeWindow = (window: BrowserWindow) => {
  if (window.isMaximized()) {
    window.unmaximize();
  } else {
    window.maximize();
  }
};

// window最小化
export const minimizeWindow = (window: BrowserWindow) => {
  window.minimize();
};

export const createChildWindow = (window: BrowserWindow, url: string) => {
  const child = new BrowserWindow({
    width: 600,
    height: 400,
    center: true,
    parent: window,
    resizable: true,
    useContentSize: true,
    autoHideMenuBar: true,
    title: url,
  });
  child.setResizable(true);
  child.loadURL(url);
  return child;
};
