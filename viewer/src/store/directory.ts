import { reactive, readonly } from "vue";
import { ImageDetail } from "../core/type/image";
import { Sort } from "../core/type/listing";

interface DirectoryState {
  openDirectoryPath: string | null;
  selectedDirectoryPath: string | null;
  imageDetails: ImageDetail[] | null;
  sort: Sort | null;
}

export default function directoryStore() {
  const state: DirectoryState = reactive({
    openDirectoryPath: null,
    selectedDirectoryPath: null,
    imageDetails: null,
    sort: null,
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
  const pushImageDetails = (imageDetails: ImageDetail[]) => {
    if (state.imageDetails) {
      state.imageDetails = state.imageDetails.concat(imageDetails);
    } else {
      state.imageDetails = imageDetails;
    }
  };
  const setImageDataUrl = (id: number, dataUrl: string) => {
    // stateのimageDetailsからidが一致するものを探してdataUrlをセットする
    if (state.imageDetails) {
      const imageDetail = state.imageDetails.find((image) => image.id === id);
      if (imageDetail) {
        imageDetail.dataUrl = dataUrl;
      }
    }
  };

  const setSortSettings = (sort: Sort) => {
    state.sort = sort;
  };

  const getViewImageDetail = () => {
    const sort = state.sort;
    if (!sort) {
      return state.imageDetails;
    }

    return state.imageDetails?.sort((a: ImageDetail, b: ImageDetail) => {
      if (sort.type === "label") {
        if (sort.order === "ASC") {
          return a.label.localeCompare(b.label);
        } else {
          return b.label.localeCompare(a.label);
        }
      } else if (sort.type === "createTime") {
        if (sort.order === "ASC") {
          return a.createdUnitTimeMs - b.createdUnitTimeMs;
        } else {
          return b.createdUnitTimeMs - a.createdUnitTimeMs;
        }
      } else {
        return 0;
      }
    });
  };

  return {
    state: readonly(state), // 読み取りしかできないようにする
    selectDirectory,
    setOpenDirectory,
    setImageDetails,
    setImageDataUrl,
    pushImageDetails,
    getViewImageDetail,
    setSortSettings,
  };
}
export type DirectoryStore = ReturnType<typeof directoryStore>;
