import { reactive, readonly } from "vue";
import { ImageDetail } from "../core/type/image";
import { FavoritePrompt } from "../core/type/favorite";

export interface FavoritePromptState {
  favorite: FavoritePrompt;
}
export default function favoritePromptState() {
  const state: FavoritePromptState = reactive({
    favorite: {
      categories: [],
    },
  });

  const setFavoritePrompt = (favorite: FavoritePrompt) => {
    state.favorite = favorite;
  };

  return {
    state: readonly(state), // 読み取りしかできないようにする
    setFavoritePrompt,
  };
}
export type FavoritePromptStore = ReturnType<typeof favoritePromptState>;
