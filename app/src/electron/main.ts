import { join } from "path";
import { app, BrowserWindow, ipcMain, dialog } from "electron";

const isDev = process.env.npm_lifecycle_event === "app:dev" ? true : false;
const isDebug = process.env.npm_lifecycle_event === "app:debug" ? true : false;

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      nodeIntegration: true, // FIXME レンダラープロセスでnode.jsを使えるようにするのは非推奨
      contextIsolation: false, // FIXME メインプロセスとレンダラープロセスは分離すべき
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
    mainWindow.loadFile(join(__dirname, "../index.html"));
  }

  // ダイアログを表示する
  ipcMain.handle("open-direcroty-dialog", async (_e, _arg) => {
    return (
      dialog
        // ファイル選択ダイアログを表示する
        .showOpenDialog(mainWindow, {
          properties: ["openDirectory"],
        })
        .then((result) => {
          // キャンセルボタンが押されたとき
          if (result.canceled) return "";

          // 選択されたファイルの絶対パスを返す
          return result.filePaths[0];
        })
    );
  });
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

// ipcMain.handle("showDialog", async (event, data) => {
//   const path = dialog.showOpenDialogSync({
//     properties: ["openDirectory"],
//     title: "Select a text file",
//     defaultPath: ".",
//     filters: [{ name: "text file", extensions: ["txt"] }],
//   });
// });
