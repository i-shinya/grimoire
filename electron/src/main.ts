import { join } from "path";
import { app, BrowserWindow, ipcMain } from "electron";
import { DirectoryNode } from "./type/directory";
import { ImageDetail, ImageIndex, ThumbnailSize } from "./type/image";
import {
  getDirectoryNodes,
  openDirectoryDialog,
  listImageIndex,
  getImages,
  getImageDataUrl,
} from "./logic/directory";
import { closeWindow, maximizeWindow, minimizeWindow } from "./logic/window";
import install, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
import {
  getFavoritePrompt,
  getThumbnailSize,
  saveFavoritePrompt,
  saveThumbnailSize,
} from "./logic/store";
import { FavoritePrompt } from "./type/favorite";

const isDev = process.env.npm_lifecycle_event === "app:dev";
const isDebug = process.env.npm_lifecycle_event === "app:debug";

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    // falseにするとフレームを全部消せる
    // ヘッダーとかをdraga可能にしないとウィンドウ移動できなくなるので注意
    frame: false,
    webPreferences: {
      preload: join(__dirname, "./preload.js"),
    },
  });

  // Open the DevTools.
  if (isDev || isDebug) {
    // devの場合はローカルサーバーからページを取得
    mainWindow.loadURL("http://localhost:3000");
    if (isDebug) {
      install(VUEJS3_DEVTOOLS).catch((err) => {
        console.log(err);
        throw new Error("failed to install VUEJS3_DEVTOOLS");
      });
      mainWindow.webContents.openDevTools();
    }
  } else {
    mainWindow.maximize();
    // dev以外の場合はファイルからページを取得
    mainWindow.loadFile(join(__dirname, "./index.html"));
  }

  // ディレクトリ操作
  // ダイアログを表示する
  ipcMain.handle(
    "open-directory-dialog",
    async (_e: Electron.IpcMainInvokeEvent, _args: any): Promise<string> => {
      return openDirectoryDialog(mainWindow);
    }
  );
  // ディレクトリノードを取得する
  ipcMain.handle(
    "get-directory-nodes",
    (_e: Electron.IpcMainInvokeEvent, path: string): DirectoryNode[] => {
      return getDirectoryNodes(path);
    }
  );
  // ディレクトリ内のファイルインデックスを取得する
  ipcMain.handle(
    "list-image-index",
    async (
      _e: Electron.IpcMainInvokeEvent,
      path: string
    ): Promise<ImageIndex[]> => {
      return listImageIndex(path);
    }
  );
  // ディレクトリ内のファイルを取得する
  ipcMain.handle(
    "get-images",
    async (
      _e: Electron.IpcMainInvokeEvent,
      basePath: string,
      imageIndex: ImageIndex[]
    ): Promise<ImageDetail[]> => {
      return getImages(basePath, imageIndex);
    }
  );
  // ディレクトリ内のファイルを取得する
  ipcMain.handle(
    "get-image-dataurl",
    async (_e: Electron.IpcMainInvokeEvent, path: string): Promise<string> => {
      return getImageDataUrl(path);
    }
  );

  // window操作
  ipcMain.handle(
    "close-window",
    async (_e: Electron.IpcMainInvokeEvent): Promise<void> => {
      closeWindow(mainWindow);
    }
  );
  ipcMain.handle(
    "resize-window",
    async (_e: Electron.IpcMainInvokeEvent): Promise<void> => {
      maximizeWindow(mainWindow);
    }
  );
  ipcMain.handle(
    "minimize-window",
    async (_e: Electron.IpcMainInvokeEvent): Promise<void> => {
      minimizeWindow(mainWindow);
    }
  );

  // ストア操作
  ipcMain.handle(
    "save-favorite-prompt",
    async (
      _e: Electron.IpcMainInvokeEvent,
      favorite: FavoritePrompt
    ): Promise<void> => {
      saveFavoritePrompt(favorite);
    }
  );
  ipcMain.handle(
    "get-favorite-prompt",
    async (_e: Electron.IpcMainInvokeEvent): Promise<FavoritePrompt | null> =>
      getFavoritePrompt()
  );
  ipcMain.handle(
    "save-thumbnail-size",
    async (
      _e: Electron.IpcMainInvokeEvent,
      size: ThumbnailSize
    ): Promise<void> => {
      saveThumbnailSize(size);
    }
  );
  ipcMain.handle(
    "get-thumbnail-size",
    async (_e: Electron.IpcMainInvokeEvent): Promise<ThumbnailSize | null> =>
      getThumbnailSize()
  );
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
