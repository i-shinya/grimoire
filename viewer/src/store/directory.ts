import { reactive, readonly } from "vue";
import { ImageDetail } from "../core/type/image";
import { DirectoryAPI, DirectoryAPIFromNode } from "../core/api/directory";

interface DirectoryState {
  openDirectoryPath: string | null;
  selectedDirectoryPath: string | null;
  imageDetails: ImageDetail[] | null;
}

// TODO 任意の実装をinjectできるようにしたいので定義場所を変えるかも
const directoryAPI: DirectoryAPI = new DirectoryAPIFromNode();

export default function directoryStore() {
  const state: DirectoryState = reactive({
    openDirectoryPath: null,
    selectedDirectoryPath: null,
    imageDetails: null,
  });

  const setOpenDirectory = (path: string) => {
    state.openDirectoryPath = path;
  };

  // ディレクトリツリーで選択
  const selectDirectory = async (path: string) => {
    state.selectedDirectoryPath = path;
    state.imageDetails = await directoryAPI.getImages(path);
  };

  return {
    state: readonly(state), // 読み取りしかできないようにする
    selectDirectory,
    setOpenDirectory,
  };
}
export type DirectoryStore = ReturnType<typeof directoryStore>;
