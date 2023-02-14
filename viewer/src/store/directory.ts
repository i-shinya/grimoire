import { reactive, readonly } from "vue";
import { ImageDetail } from "../core/type/image";

interface DirectoryState {
  openDirectoryPath: string | null;
  selectedDirectoryPath: string | null;
  imageDetails: ImageDetail[] | null;
}

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
  const selectDirectory = (path: string) => {
    state.selectedDirectoryPath = path;
  };

  const setImageDetails = (imageDetails: ImageDetail[]) => {
    state.imageDetails = imageDetails;
  };

  return {
    state: readonly(state), // 読み取りしかできないようにする
    selectDirectory,
    setOpenDirectory,
    setImageDetails,
  };
}
export type DirectoryStore = ReturnType<typeof directoryStore>;
