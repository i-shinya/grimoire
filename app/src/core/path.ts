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
export class DirectoryNode {
  public id: number; // 適当に採番してつけるかも
  public label: string; // ディレクトリ or ファイル名
  public fullPath: string;
  public isDirectory: boolean;
  public children?: DirectoryNode[];

  constructor(
    id: number,
    label: string,
    fullPath: string,
    isDirectory: boolean,
    children?: DirectoryNode[]
  ) {
    this.id = id;
    this.label = label;
    this.fullPath = fullPath;
    this.isDirectory = isDirectory;
    this.children = children;
  }

  hasChildren(): boolean {
    return !!this.children && this.children.length > 0;
  }
}
