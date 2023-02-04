import { BrowserWindow } from "electron";
// windowを閉じる
export const closeWindow = (window: BrowserWindow) => {
  window.close();
};

// window最大化
export const maximizeWindow = (window: BrowserWindow) => {
  window.maximize();
};

// window最小化
export const minimizeWindow = (window: BrowserWindow) => {
  window.minimize();
};

// windowデフォルトサイズ化（最大化前のサイズに戻す）
