export function getDirectroyName(pathName: string) {
  return pathName.split("\\").pop()?.split("/").pop();
}

export const getBaseDirName = (pathName: string) => {
  const directoryName = pathName.split("\\").pop()?.split("/").pop();
  return pathName
    .split(`\\${directoryName}`)
    .shift()
    ?.split(`/${directoryName}`)
    .shift();
};

// ディレクトリの再帰モデル
export type DirectoryNode = {
  id: number; // 適当に採番してつけるかも
  label: string; // ディレクトリ or ファイル名
  fullPath: string;
  isDirectory: boolean;
  children?: DirectoryNodeArray;
};
export interface DirectoryNodeArray extends Array<DirectoryNode> {}
