import { reactive } from "vue";
import { ImageDetail } from "../core/type/image";

interface ImageState {
  selectedImageBasePath: string | null;
  imageDetail: ImageDetail | null;
}

export default function imageStore() {
  const state: ImageState = reactive({
    selectedImageBasePath: null,
    imageDetail: null,
  });

  const selectImage = async (path: string, imageDetail: ImageDetail) => {
    state.selectedImageBasePath = path;
    state.imageDetail = imageDetail;
  };

  return {
    state,
    selectDirectory: selectImage,
  };
}
export type ImageStore = ReturnType<typeof imageStore>;
