import { reactive } from "vue";
import { ImageDetail } from "../core/type/image";

interface DirectoryState {
  selectedDirectoryPath: string | null;
  imageDetails: ImageDetail[] | null;
}

export default function directoryStore() {
  const state: DirectoryState = reactive({
    selectedDirectoryPath: null,
    imageDetails: null,
  });

  // ディレクトリツリーで選択
  const selectDirectory = async (path: string) => {
    state.selectedDirectoryPath = path;
    state.imageDetails = await (window as any).direcrotyAPI.getImages(path);
  };

  return {
    state,
    selectDirectory,
  };
}
export type DirectoryStore = ReturnType<typeof directoryStore>;
