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

// デモ用は何もしない
export class WindowDemoAPI implements WindowAPI {
  async closeWindow(): Promise<void> {
    return;
  }

  async resizeWindow(): Promise<void> {
    return;
  }

  async minimizeWindow(): Promise<void> {
    return;
  }
}
