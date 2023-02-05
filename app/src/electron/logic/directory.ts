/**
 * directory.ts
 * ディレクトリ操作を行う処理を定義する
 */
import fs from "fs";
import { dialog, BrowserWindow } from "electron";
import exifr from "exifr";

import { DirectoryNode } from "../../core/type/directory";
import { ImageDetail, Metadata } from "../../core/type/image";

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

/**
 * 画像データが取得できる
 * @param path ディレクトリパス
 * @returns
 */
export const getImages = async (path: string): Promise<ImageDetail[]> => {
  const dirents = fs
    .readdirSync(path, { withFileTypes: true })
    .filter((dirent: fs.Dirent) => {
      return dirent.isFile() && isImage(dirent.name);
    });
  return await Promise.all(
    dirents.map(async (dirent: fs.Dirent, index: number) => {
      const buffer = readImage(`${path}/${dirent.name}`);
      const meta = await getImageMeta(`${path}/${dirent.name}`);
      return {
        id: index,
        label: dirent.name,
        buffer: buffer,
        dataUrl: "data:image/png;base64," + buffer.toString("base64"),
        meta: meta,
      };
    })
  );
};

/**
 * 拡張子チェック
 * @param filename
 * @returns
 */
const isImage = (filename: string): boolean => {
  const allowExtensions = ".(jpeg|jpg|png|bmp|gif|JPEG|JPG|PNG|BMP|GIF)$";
  return !!filename.match(allowExtensions);
};

/**
 * 画像の読み込み
 * @param path
 * @returns
 */
export const readImage = (path: string): Buffer => {
  return fs.readFileSync(path);
};

/**
 * 画像のメタデータを取得する
 * @param path ファイルパス
 * @returns
 */
export const getImageMeta = async (path: string): Promise<Metadata> => {
  return exifr.parse(path).then((metadata: any) => {
    const meta = Metadata.build(metadata);
    return meta;
  });
};