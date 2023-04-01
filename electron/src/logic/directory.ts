/**
 * directory.ts
 * ディレクトリ操作を行う処理を定義する
 */
import fs from "fs";
import * as fsp from "fs/promises";
import { BrowserWindow, dialog } from "electron";

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
export const getDirectoryNodes = async (
  path: string
): Promise<DirectoryNode[]> => {
  const idCounter = new FileIdCounter();
  const dirents = await fsp.readdir(path, { withFileTypes: true });
  // ファイル名でソート
  const sorted = dirents.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    } else {
      return -1;
    }
  });
  const nodes = await Promise.all(
    sorted.map(async (dirent: fs.Dirent): Promise<DirectoryNode> => {
      if (dirent.isDirectory()) {
        const nodes = await getDirectoryNodes(`${path}/${dirent.name}`);
        const sorted = nodes.sort((a, b) =>
          a.hasChildren() > b.hasChildren() ? -1 : 1
        );
        return new DirectoryNode(
          idCounter.next(),
          dirent.name,
          path,
          true,
          sorted
        );
      } else {
        return new DirectoryNode(idCounter.next(), dirent.name, path, false);
      }
    })
  );
  return nodes.sort((a, b) => (a.hasChildren() > b.hasChildren() ? -1 : 1));
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
  const dirents = await fsp.readdir(path, { withFileTypes: true });
  return dirents
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
export const getImages = async (
  basepath: string,
  imageIndex: ImageIndex[]
): Promise<ImageDetail[]> => {
  return await Promise.all(
    imageIndex.map(async (image: ImageIndex) => {
      // TODO 性能悪くなったらstatとメタデータ取得も並列で動かすようにしてもいいかも
      const res = await fsp.stat(`${basepath}/${image.label}`);
      const meta = await getImageMeta(`${basepath}/${image.label}`);
      return {
        id: image.index,
        label: image.label,
        createdUnitTimeMs: res.birthtime.getTime(),
        meta: meta,
      };
    })
  );
};

export const getImageDataUrl = async (path: string): Promise<string> => {
  const buffer = await readImage(path);
  return "data:image/png;base64," + buffer.toString("base64");
};

/**
 * 拡張子が画像か判定する
 * @param filename
 */
export const isImageExtension = (filename: string): boolean => {
  const allowExtensions = ".(png|PNG)$";
  return !!filename.match(allowExtensions);
};

/**
 * 画像の読み込み
 * @param path
 * @returns
 */
export const readImage = async (path: string): Promise<Buffer> => {
  return await fsp.readFile(path);
};

/**
 * 画像のメタデータを取得する
 * @param path ファイルパス
 * @returns
 */
export const getImageMeta = async (path: string): Promise<Metadata | null> => {
  let metaJson: any = {};

  const buffer = await fsp.readFile(path);
  const arrayBuffer = new Uint8Array(buffer).buffer;
  const view = new DataView(arrayBuffer);
  // PNGチェック
  const signaturePart1 = view.getUint32(0);
  const signaturePart2 = view.getUint32(4);
  if (signaturePart1 !== 0x89504e47 || signaturePart2 !== 0x0d0a1a0a) {
    return null;
  }

  let offset = 8; // Skip the PNG signature
  while (offset < buffer.byteLength) {
    const chunkLength = view.getUint32(offset);
    offset += 4;

    const chunkType = new TextDecoder("ascii").decode(
      new Uint8Array(arrayBuffer, offset, 4)
    );
    offset += 4;

    // console.log(
    //   `offset: ${
    //     offset - 4
    //   }, chunkType: ${chunkType}, chunkLength: ${chunkLength}`
    // );

    if (chunkType === "IEND") {
      break;
    }

    metaJson.ImageWidth = view.getUint32(16, false);
    metaJson.ImageHeight = view.getUint32(20, false);

    if (chunkType === "tEXt") {
      const textData = new Uint8Array(arrayBuffer, offset, chunkLength);
      const keywordValuePair = new TextDecoder("utf-8").decode(textData); // asciiが動かなかったのでutf-8に変更
      const [keyword, value] = keywordValuePair.split("\x00");
      metaJson[keyword] = value;
    }

    offset += chunkLength + 4;
  }
  return Metadata.build(metaJson);
};
