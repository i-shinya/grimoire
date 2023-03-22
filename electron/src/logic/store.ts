import ElectronStore from "electron-store";
import { FavoritePrompt } from "../type/favorite";
import { ThumbnailSize } from "../type/image";
import { Sort } from "../type/sort";

const store = new ElectronStore();

const FavoritePromptKey = "FavoritePromptKey";
const ThumbnailSizeKey = "ThumbnailSizeKey";
const SortSettingsKey = "SortSettingsKey";
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

export const saveThumbnailSize = (size: ThumbnailSize) => {
  store.set(ThumbnailSizeKey, size);
};

export const getThumbnailSize = (): ThumbnailSize | null => {
  const res = store.get(ThumbnailSizeKey, null);
  return res as ThumbnailSize | null;
};

export const saveSortSettings = (sort: Sort) => {
  store.set(SortSettingsKey, sort);
};

export const getSortSettings = (): Sort | null => {
  const res = store.get(SortSettingsKey, null);
  return res as Sort | null;
};
