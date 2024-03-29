import { join } from "path";
import { app, BrowserWindow, ipcMain } from "electron";
import { DirectoryNode } from "./type/directory";
import {
  ImageDetail,
  ImageIndex,
  ImageLocation,
  ThumbnailSize,
} from "./type/image";
import {
  getDirectoryNodes,
  openDirectoryDialog,
  listImageIndex,
  getImages,
  getImageDataUrl,
  copyFiles,
  forceCopyFiles,
} from "./logic/directory";
import {
  closeWindow,
  createChildWindow,
  maximizeWindow,
  minimizeWindow,
} from "./logic/window";
import install, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import {
  getFavoritePrompt,
  getSortSettings,
  getThumbnailSize,
  saveFavoritePrompt,
  saveSortSettings,
  saveThumbnailSize,
} from "./logic/store";
import { FavoritePrompt } from "./type/favorite";
import { Sort } from "./type/sort";

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
    show: false,
    webPreferences: {
      preload: join(__dirname, "./preload.js"),
    },
  });
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  // Open the DevTools.
  if (isDev || isDebug) {
    // devの場合はローカルサーバーからページを取得
    mainWindow.loadURL("http://localhost:3000");
    if (isDebug) {
      install(VUEJS_DEVTOOLS).catch((err) => {
        console.log(err);
        throw new Error("failed to install VUEJS_DEVTOOLS");
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
    async (
      _e: Electron.IpcMainInvokeEvent,
      path: string
    ): Promise<DirectoryNode[]> => {
      return await getDirectoryNodes(path);
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
  // ファイルを指定ディレクトリにコピーする
  ipcMain.handle(
    "copy-images",
    async (
      _e: Electron.IpcMainInvokeEvent,
      files: ImageLocation[],
      destinationFolderPath: string
    ): Promise<ImageLocation[]> => {
      return await copyFiles(files, destinationFolderPath);
    }
  );
  // ファイルを指定ディレクトリにコピーする
  ipcMain.handle(
    "force-copy-images",
    async (
      _e: Electron.IpcMainInvokeEvent,
      files: ImageLocation[],
      destinationFolderPath: string
    ): Promise<void> => {
      return await forceCopyFiles(files, destinationFolderPath);
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
  ipcMain.handle(
    "show-child-window",
    async (_e: Electron.IpcMainInvokeEvent, url: string): Promise<void> => {
      createChildWindow(mainWindow, url);
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
  ipcMain.handle(
    "save-sort-settings",
    async (_e: Electron.IpcMainInvokeEvent, sort: Sort): Promise<void> => {
      saveSortSettings(sort);
    }
  );
  ipcMain.handle(
    "get-sort-settings",
    async (_e: Electron.IpcMainInvokeEvent): Promise<Sort | null> =>
      getSortSettings()
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
