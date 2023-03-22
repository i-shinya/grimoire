// inject用のkey
import { FavoritePrompt } from "../type/favorite";
import { InjectionKey } from "vue";
import { ThumbnailSize } from "../type/image";
import { Sort } from "../type/listing";

export const StoreAPIKey: InjectionKey<StoreAPI> = Symbol("StoreAPIKey");

export interface StoreAPI {
  saveFavoritePrompt(favoritePrompt: FavoritePrompt): Promise<void>;
  getFavoritePrompt(): Promise<FavoritePrompt>;
  saveThumbnailSize(size: ThumbnailSize): Promise<void>;
  getThumbnailSize(): Promise<ThumbnailSize>;
  saveSortSettings(sort: Sort): Promise<void>;
  getSortSettings(): Promise<Sort>;
}

const defaultFavorite = {
  categories: [
    {
      id: 1,
      label: "pattern",
      children: [
        {
          id: 1,
          label: "basic",
          value: "masterpiece, best quality",
        },
        { id: 2, label: "anime", value: "anime screencap" },
      ],
    },
    {
      id: 2,
      label: "background",
      children: [{ id: 1, label: "tokyo", value: "Tokyo, city" }],
    },
  ],
};

const defaultSort: Sort = {
  type: "label",
  order: "ASC",
};

export class StoreNodeAPI implements StoreAPI {
  async saveFavoritePrompt(favoritePrompt: FavoritePrompt): Promise<void> {
    await window.storeAPI.saveFavoritePrompt(favoritePrompt);
  }

  async getFavoritePrompt(): Promise<FavoritePrompt> {
    const res = await window.storeAPI.getFavoritePrompt();
    // nullの場合はデフォルト値を設定して返却する
    return (res ?? defaultFavorite) as FavoritePrompt;
  }

  async saveThumbnailSize(size: ThumbnailSize): Promise<void> {
    await window.storeAPI.saveThumbnailSize(size);
  }

  async getThumbnailSize(): Promise<ThumbnailSize> {
    const res = await window.storeAPI.getThumbnailSize();
    // nullの場合はデフォルト値を設定して返却する
    return (res ?? "default") as ThumbnailSize;
  }

  async saveSortSettings(sort: Sort): Promise<void> {
    await window.storeAPI.saveSortSettings(sort);
  }

  async getSortSettings(): Promise<Sort> {
    const res = await window.storeAPI.getSortSettings();
    // nullの場合はデフォルト値を設定して返却する
    return (res ?? defaultSort) as Sort;
  }
}

export class StoreDemoAPI implements StoreAPI {
  async saveFavoritePrompt(favoritePrompt: FavoritePrompt): Promise<void> {
    return;
  }

  async getFavoritePrompt(): Promise<FavoritePrompt> {
    return defaultFavorite;
  }

  async saveThumbnailSize(size: ThumbnailSize): Promise<void> {
    return;
  }

  async getThumbnailSize(): Promise<ThumbnailSize> {
    return "default";
  }

  async saveSortSettings(sort: Sort): Promise<void> {
    return;
  }

  async getSortSettings(): Promise<Sort> {
    return defaultSort;
  }
}
