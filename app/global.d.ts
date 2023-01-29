interface Window {
  direcrotyAPI: DirecrotyAPI;
}

interface DirecrotyAPI {
  openDialog: () => Promise<string>;
}

declare let openDialog: Window["direcrotyAPI"];
