import ElectronStore from "electron-store";
import { FavoritePrompt } from "../type/favorite";

const store = new ElectronStore();

const FavoritePromptKey = "FavoritePromptKey";
/**
 * ファイルの保存先は以下っぽい（開発時はアプリ名がelectron）
 * - windows
 *   - C:\Users\xxxx\AppData\grimoire
 * - mac
 *   - /Users/xxxx/Library/Application Support/grimoire/config.json
 * - linux
 *   - /home/xxxx/.config/grimoire/config.json
 * @param favorite
 */
export const saveFavoritePrompt = (favorite: FavoritePrompt) => {
  store.set(FavoritePromptKey, favorite);
};

export const getFavoritePrompt = (): FavoritePrompt | null => {
  const res = store.get(FavoritePromptKey, null);
  return res as FavoritePrompt | null;
};
