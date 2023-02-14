export interface WindowAPI {
  closeWindow(): Promise<void>;
  resizeWindow(): Promise<void>;
  minimizeWindow(): Promise<void>;
}

export class WindowAPIFromNode implements WindowAPI {
  async closeWindow(): Promise<void> {
    return (window as any).windowAPI.closeWindow();
  }

  async resizeWindow(): Promise<void> {
    (window as any).windowAPI.resizeWindow();
  }

  async minimizeWindow(): Promise<void> {
    (window as any).windowAPI.minimizeWindow();
  }
}
