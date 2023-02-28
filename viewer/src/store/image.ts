import { reactive, readonly } from "vue";
import { ImageDetail } from "../core/type/image";

export type ThumbnailSize = "small" | "default" | "big";

export interface ImageState {
  selectedImageBasePath: string | null;
  imageDetail: ImageDetail | null;
  thumbnailSize: ThumbnailSize;
}

export default function imageStore() {
  const state: ImageState = reactive({
    selectedImageBasePath: null,
    imageDetail: null,
    thumbnailSize: "default",
  });

  // 画像ビューワーから選択
  const selectImage = (path: string, imageDetail: ImageDetail) => {
    state.selectedImageBasePath = path;
    state.imageDetail = imageDetail;
  };

  const changeThumbnailSize = (size: ThumbnailSize) => {
    state.thumbnailSize = size;
  };

  return {
    state: readonly(state), // 読み取りしかできないようにする
    changeThumbnailSize,
    selectImage,
  };
}
export type ImageStore = ReturnType<typeof imageStore>;
