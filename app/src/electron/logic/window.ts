import { tsThisType } from "@babel/types";
import { BrowserWindow } from "electron";

export const defaultWidth = 1600;
export const defaultHeight = 900;

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
