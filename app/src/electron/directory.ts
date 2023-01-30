/**
 * directory.ts
 * ディレクトリ操作を行う処理を定義する
 */
import fs from "fs";
import { dialog, BrowserWindow } from "electron";

import { DirectoryNode } from "../core/path";

export const openDirectoryDialog = (
  mainWindow: BrowserWindow
): Promise<string> => {
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
};

/**
 * ディレクトリノードを取得する
 * @param path
 * @returns
 */
export const getDirectroyNodes = (path: string): DirectoryNode[] => {
  const idCounter = new FileIdCounter();
  return fs
    .readdirSync(path, { withFileTypes: true })
    .map((dirent): DirectoryNode => {
      if (dirent.isFile()) {
        return {
          id: idCounter.next(),
          label: dirent.name,
          fullPath: `${path}/${dirent.name}`,
          isDirectory: false,
        };
      } else {
        const nodes = getDirectroyNodes(`${path}/${dirent.name}`);
        return {
          id: idCounter.next(),
          label: dirent.name,
          fullPath: `${path}/${dirent.name}`,
          isDirectory: true,
          children: nodes,
        };
      }
    });
};

class FileIdCounter {
  private id: number = 0;
  next(): number {
    this.id++;
    return this.id;
  }
}
