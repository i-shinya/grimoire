/**
 * directory.ts
 * ディレクトリ操作を行う処理を定義する
 */
import fs from "fs";
import { dialog, BrowserWindow } from "electron";

import { DirectoryNode } from "../core/type/directory";

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
 * TODO パーミッションエラーの場合の処理必要かも
 * @param path
 * @returns
 */
export const getDirectroyNodes = (path: string): DirectoryNode[] => {
  const idCounter = new FileIdCounter();
  return fs
    .readdirSync(path, { withFileTypes: true })
    .map((dirent: fs.Dirent): DirectoryNode => {
      if (dirent.isDirectory()) {
        const nodes = getDirectroyNodes(`${path}/${dirent.name}`).sort((a, b) =>
          a.hasChildren() > b.hasChildren() ? -1 : 1
        );
        return new DirectoryNode(
          idCounter.next(),
          dirent.name,
          `${path}/${dirent.name}`,
          true,
          nodes
        );
      } else {
        return new DirectoryNode(
          idCounter.next(),
          dirent.name,
          `${path}/${dirent.name}`,
          true
        );
      }
    })
    .sort((a, b) => (a.hasChildren() > b.hasChildren() ? -1 : 1));
};

class FileIdCounter {
  private id: number = 0;
  next(): number {
    this.id++;
    return this.id;
  }
}
