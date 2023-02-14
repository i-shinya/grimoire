export const WindowAPIKey = Symbol("WindowAPIKey");

export interface WindowAPI {
  closeWindow(): Promise<void>;
  resizeWindow(): Promise<void>;
  minimizeWindow(): Promise<void>;
}

// FIXME global.d.tsの型定義が上手く読めないのでas anyにしている。そのうち修正したい
export class WindowNodeAPI implements WindowAPI {
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
