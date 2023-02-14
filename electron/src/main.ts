import { join } from "path";
import { app, BrowserWindow, ipcMain } from "electron";
import { DirectoryNode } from "./type/directory";
import { ImageDetail } from "./type/image";
import {
  getDirectroyNodes,
  getImages,
  openDirectoryDialog,
} from "./logic/directory";
import {
  closeWindow,
  maximizeWindow,
  minimizeWindow,
  defaultHeight,
  defaultWidth,
} from "./logic/window";

const isDev = process.env.npm_lifecycle_event === "app:dev";
const isDebug = process.env.npm_lifecycle_event === "app:debug";

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: defaultWidth,
    height: defaultHeight,
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
      mainWindow.webContents.openDevTools();
    }
  } else {
    // dev以外の場合はファイルからページを取得
    mainWindow.loadFile(join(__dirname, "./index.html"));
  }

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
      return getDirectroyNodes(path);
    }
  );
  // ディレクトリ内のファイルを取得する
  ipcMain.handle(
    "get-images",
    async (
      _e: Electron.IpcMainInvokeEvent,
      path: string
    ): Promise<ImageDetail[]> => {
      return getImages(path);
    }
  );

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
