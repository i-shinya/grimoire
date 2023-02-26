import { reactive, readonly } from "vue";

interface AreaVisibilityState {
  showDirectoryArea: boolean;
  showImageArea: boolean;
  showEditorArea: boolean;
  showImageMetaViewer: boolean;
  showPromptEditor: boolean;
  showLoading: boolean;
  rightSideVisibilityState: RightSideVisibilityState;
}

interface RightSideVisibilityState {
  showArea: boolean;
  showFavoritePromptFrame: boolean;
}

export default function areaVisibilityStore() {
  const state: AreaVisibilityState = reactive({
    showDirectoryArea: true,
    showImageArea: true,
    showEditorArea: false,
    showImageMetaViewer: false,
    // 現状はエディター部分が表示されている時は常に表示
    // 今後もいらなかったらフラグを削除しても良さそう
    showPromptEditor: true,
    showLoading: false,
    rightSideVisibilityState: {
      showArea: false,
      showFavoritePromptFrame: false,
    },
  });

  const changeDirectoryVisibility = () => {
    state.showDirectoryArea = !state.showDirectoryArea;
  };
  const changeEditorVisibility = () => {
    state.showEditorArea = !state.showEditorArea;
  };

  const changeImageArea = () => {
    state.showImageArea = !state.showImageArea;
  };

  const showImageAres = () => {
    state.showImageArea = true;
  };

  const showImageMetaViewer = () => {
    state.showImageMetaViewer = true;
  };

  const showEditorArea = () => {
    state.showEditorArea = true;
  };

  const showPromptEditor = () => {
    state.showPromptEditor = true;
  };

  const showLoading = () => {
    state.showLoading = true;
  };

  const hiddenLoading = () => {
    state.showLoading = false;
  };

  const changeRightSideVisibility = () => {
    state.rightSideVisibilityState.showArea =
      !state.rightSideVisibilityState.showArea;
  };

  const changeFavoritePromptFrame = () => {
    state.rightSideVisibilityState.showFavoritePromptFrame =
      !state.rightSideVisibilityState.showFavoritePromptFrame;
  };

  return {
    state: readonly(state), // 読み取りしかできないようにする
    changeDirectoryVisibility,
    changeEditorVisibility,
    changeImageArea,
    changeRightSideVisibility,
    showImageAres,
    showImageMetaViewer,
    showEditorArea,
    showPromptEditor,
    showLoading,
    hiddenLoading,
    changeFavoritePromptFrame,
  };
}
export type AreaVisibilityStore = ReturnType<typeof areaVisibilityStore>;
