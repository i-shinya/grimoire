/**
 * directory.ts
 * ディレクトリ操作を行う処理を定義する
 */
import fs from "fs";
import { dialog, BrowserWindow } from "electron";
import exifr from "exifr";

import { DirectoryNode } from "../type/directory";
import { ImageDetail, ImageIndex, Metadata } from "../type/image";

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
export const getDirectoryNodes = (path: string): DirectoryNode[] => {
  const idCounter = new FileIdCounter();
  return (
    fs
      .readdirSync(path, { withFileTypes: true })
      // ファイル名でソート
      .sort((a, b) => {
        if (a.name > b.name) {
          return 1;
        } else {
          return -1;
        }
      })
      .map((dirent: fs.Dirent): DirectoryNode => {
        if (dirent.isDirectory()) {
          const nodes = getDirectoryNodes(`${path}/${dirent.name}`).sort(
            (a, b) => (a.hasChildren() > b.hasChildren() ? -1 : 1)
          );
          return new DirectoryNode(
            idCounter.next(),
            dirent.name,
            path,
            true,
            nodes
          );
        } else {
          return new DirectoryNode(idCounter.next(), dirent.name, path, false);
        }
      })
      .sort((a, b) => (a.hasChildren() > b.hasChildren() ? -1 : 1))
  );
};

class FileIdCounter {
  private id: number = 0;
  next(): number {
    this.id++;
    return this.id;
  }
}

// ディレクトリ配下のファイル一覧を取得する
export const listImageIndex = async (path: string): Promise<ImageIndex[]> => {
  return fs
    .readdirSync(path, { withFileTypes: true })
    .filter((dirent: fs.Dirent) => {
      return dirent.isFile() && isImageExtension(dirent.name);
    })
    .sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      } else {
        return -1;
      }
    })
    .map((dirent: fs.Dirent, index: number) => {
      return {
        index,
        label: dirent.name,
      };
    });
};

// 対象の画像一覧を取得する
export const getImages = async (basepath: string, imageIndex: ImageIndex[]) => {
  return await Promise.all(
    imageIndex.map(async (image: ImageIndex) => {
      // TODO メタデータ取得も並列で動かすようにしてもいいかも
      const meta = await getImageMeta(`${basepath}/${image.label}`);
      return {
        id: image.index,
        label: image.label,
        meta: meta,
      };
    })
  );
};

export const getImageDataUrl = (path: string): string => {
  const buffer = readImage(path);
  return "data:image/png;base64," + buffer.toString("base64");
};

/**
 * 画像データが取得できる
 * NOTE: 性能的に使用できなさそうなので廃止予定
 * @param path ディレクトリパス
 * @returns
 */
export const getAllImages = async (path: string): Promise<ImageDetail[]> => {
  const dirents = fs
    .readdirSync(path, { withFileTypes: true })
    .filter((dirent: fs.Dirent) => {
      return dirent.isFile() && isImageExtension(dirent.name);
    });
  return await Promise.all(
    dirents.map(async (dirent: fs.Dirent, index: number) => {
      // TODO サムネイル画像だから圧縮した方が良いかも
      const buffer = readImage(`${path}/${dirent.name}`);
      const meta = await getImageMeta(`${path}/${dirent.name}`);
      return {
        id: index,
        label: dirent.name,
        dataUrl: "data:image/png;base64," + buffer.toString("base64"),
        meta: meta,
      };
    })
  );
};

/**
 * 拡張子が画像か判定する
 * @param filename
 */
export const isImageExtension = (filename: string): boolean => {
  const allowExtensions = ".(jpeg|jpg|png|JPEG|JPG|PNG)$";
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
export const getImageMeta = async (path: string): Promise<Metadata | null> => {
  return exifr.parse(path).then((metadata: any) => Metadata.build(metadata));
};
