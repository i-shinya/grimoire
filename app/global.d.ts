import { DirectoryNode } from "./src/core/path";
interface Window {
  direcrotyAPI: DirecrotyAPI;
}

interface DirecrotyAPI {
  openDialog: () => Promise<string>;
  showDirectories: () => Promise<DirectoryNode>;
}

declare let openDialog: Window["direcrotyAPI"];
