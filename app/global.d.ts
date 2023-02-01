import { DirectoryNode } from "./src/core/type/directory";
interface Window {
  direcrotyAPI: DirecrotyAPI;
}

interface DirecrotyAPI {
  openDialog: () => Promise<string>;
  showDirectories: () => Promise<DirectoryNode>;
}

declare let openDialog: Window["direcrotyAPI"];
