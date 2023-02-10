import { reactive, readonly } from "vue";

interface AreaVisiblityState {
  showDirectoryArea: boolean;
  showImageArea: boolean;
  showEditorArea: boolean;
  showImageMetaViewer: boolean;
  showPromptEditor: boolean;
}

export default function areaVisiblityStore() {
  const state: AreaVisiblityState = reactive({
    showDirectoryArea: true,
    showImageArea: true,
    showEditorArea: false,
    showImageMetaViewer: false,
    // 現状はエディター部分が表示されている時は常に表示
    // 今後もいらなかったらフラグを削除しても良さそう
    showPromptEditor: true,
  });

  const changeDirectoryVisiblility = () => {
    state.showDirectoryArea = !state.showDirectoryArea;
  };
  const changeEditorVisiblility = () => {
    state.showEditorArea = !state.showEditorArea;
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
    changeDirectoryVisiblility,
    changeEditorVisiblility,
    showImageMetaViewer,
    showEditorArea,
    showPromptEditor,
  };
}
export type AreaVisiblityStore = ReturnType<typeof areaVisiblityStore>;
