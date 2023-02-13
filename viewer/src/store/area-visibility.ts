import { reactive, readonly } from "vue";

interface AreaVisibilityState {
  showDirectoryArea: boolean;
  showImageArea: boolean;
  showEditorArea: boolean;
  showImageMetaViewer: boolean;
  showPromptEditor: boolean;
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

  const showImageMetaViewer = () => {
    state.showImageMetaViewer = true;
  };

  const showEditorArea = () => {
    state.showEditorArea = true;
  };

  const showPromptEditor = () => {
    state.showPromptEditor = true;
  };

  return {
    state: readonly(state), // 読み取りしかできないようにする
    changeDirectoryVisibility,
    changeEditorVisibility,
    changeImageArea,
    showImageMetaViewer,
    showEditorArea,
    showPromptEditor,
  };
}
export type AreaVisibilityStore = ReturnType<typeof areaVisibilityStore>;