import { DirectoryNode } from "../type/directory";
import { ImageDetail } from "../type/image";

export interface DirectoryAPI {
  openDialog(): Promise<string>;
  showDirectories(path: string): Promise<DirectoryNode[]>;
  getImages(path: string): Promise<ImageDetail[]>;
}

export class DirectoryAPIFromNode implements DirectoryAPI {
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
