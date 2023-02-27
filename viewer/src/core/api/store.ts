// inject用のkey
import { FavoritePrompt } from "../type/favorite";
import { InjectionKey } from "vue";

export const StoreAPIKey: InjectionKey<StoreAPI> = Symbol("StoreAPIKey");

export interface StoreAPI {
  saveFavoritePrompt(favoritePrompt: FavoritePrompt): Promise<void>;
  getFavoritePrompt(): Promise<FavoritePrompt>;
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

export class StoreNodeAPI implements StoreAPI {
  async saveFavoritePrompt(favoritePrompt: FavoritePrompt): Promise<void> {
    await window.storeAPI.saveFavoritePrompt(favoritePrompt);
  }

  async getFavoritePrompt(): Promise<FavoritePrompt> {
    const res = await window.storeAPI.getFavoritePrompt();
    // nullの場合はデフォルト値を設定して返却する
    return res ?? defaultFavorite;
  }
}

export class StoreDemoAPI implements StoreAPI {
  async saveFavoritePrompt(favoritePrompt: FavoritePrompt): Promise<void> {
    return;
  }

  async getFavoritePrompt(): Promise<FavoritePrompt> {
    return defaultFavorite;
  }
}
