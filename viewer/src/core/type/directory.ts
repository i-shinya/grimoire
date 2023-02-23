// ディレクトリの再帰モデル
export class DirectoryNode {
  public id: number; // 適当に採番してつけるかも
  public label: string; // ディレクトリ or ファイル名
  public basePath: string; // 親ディレクトリ名
  public isDirectory: boolean;
  public children?: DirectoryNode[];

  constructor(
    id: number,
    label: string,
    basePath: string,
    isDirectory: boolean,
    children?: DirectoryNode[]
  ) {
    this.id = id;
    this.label = label;
    this.basePath = basePath;
    this.isDirectory = isDirectory;
    this.children = children;
  }

  public hasChildren(): boolean {
    return !!this.children && this.children.length > 0;
  }
}
