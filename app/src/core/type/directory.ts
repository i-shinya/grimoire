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

  public hasChildren(): boolean {
    return !!this.children && this.children.length > 0;
  }
}
