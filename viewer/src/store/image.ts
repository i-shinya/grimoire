import { reactive, readonly } from "vue";
import { ImageDetail } from "../core/type/image";

export interface ImageState {
  selectedImageBasePath: string | null;
  imageDetail: ImageDetail | null;
}

export default function imageStore() {
  const state: ImageState = reactive({
    selectedImageBasePath: null,
    imageDetail: null,
  });

  // 画像ビューワーから選択
  const selectImage = (path: string, imageDetail: ImageDetail) => {
    state.selectedImageBasePath = path;
    state.imageDetail = imageDetail;
  };

  return {
    state: readonly(state), // 読み取りしかできないようにする
    selectImage,
  };
}
export type ImageStore = ReturnType<typeof imageStore>;
