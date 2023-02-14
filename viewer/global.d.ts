import { DirectoryNode } from "./src/core/type/directory";
interface Window {
  directoryAPI: DirectoryAPI;
}

interface DirectoryAPI {
  openDialog: () => Promise<string>;
  showDirectories: () => Promise<DirectoryNode>;
}

declare let openDialog: Window["directoryAPI"];
