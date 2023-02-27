// ここにもあるけど上手くimportできない
// https://github.com/sindresorhus/electron-store/issues/89

import { getFavoritePrompt, saveFavoritePrompt } from "./store";

describe("store.ts", () => {
  it("favorite promptを保存し取得する", () => {
    const initial = getFavoritePrompt();
    expect(initial).toMatchObject({});

    saveFavoritePrompt({ categories: [] });

    const result = getFavoritePrompt();
    expect(result).toMatchObject({});
  });
});
