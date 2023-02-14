import { DirectoryNode } from "../type/directory";
import { ImageDetail } from "../type/image";

export const DirectoryAPIKey = Symbol("DirectoryAPIKey");

export interface DirectoryAPI {
  openDialog(): Promise<string>;
  showDirectories(path: string): Promise<DirectoryNode[]>;
  getImages(path: string): Promise<ImageDetail[]>;
}

// FIXME global.d.tsの型定義が上手く読めないのでas anyにしている。そのうち修正したい
export class DirectoryNodeAPI implements DirectoryAPI {
  async openDialog(): Promise<string> {
    return await (window as any).directoryAPI.openDialog();
  }

  async showDirectories(path: string): Promise<DirectoryNode[]> {
    return await (window as any).directoryAPI.showDirectories(path);
  }

  async getImages(path: string): Promise<ImageDetail[]> {
    return await (window as any).directoryAPI.getImages(path);
  }
}
