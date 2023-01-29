interface Window {
  openDialog: () => Promise<string>;
}

declare let openDialog: Window["openDialog"];
