// inject用のkey
export const WindowAPIKey = Symbol("WindowAPIKey");

export interface WindowAPI {
  closeWindow(): Promise<void>;
  resizeWindow(): Promise<void>;
  minimizeWindow(): Promise<void>;
}

export class WindowNodeAPI implements WindowAPI {
  async closeWindow(): Promise<void> {
    return await window.windowAPI.closeWindow();
  }

  async resizeWindow(): Promise<void> {
    await window.windowAPI.resizeWindow();
  }

  async minimizeWindow(): Promise<void> {
    await window.windowAPI.minimizeWindow();
  }
}
