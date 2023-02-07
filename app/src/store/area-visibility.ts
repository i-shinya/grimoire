import { reactive } from "vue";

interface AreaVisiblilityState {
  showDirectoryArea: boolean;
  showImageArea: boolean;
  showEditorArea: boolean;
  showImageMetaViewer: boolean;
  showPromptEditor: boolean;
}

export default function areaVisiblilityStore() {
  const state: AreaVisiblilityState = reactive({
    showDirectoryArea: true,
    showImageArea: true,
    showEditorArea: false,
    showImageMetaViewer: false,
    showPromptEditor: false,
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
    state,
    changeDirectoryVisiblility,
    changeEditorVisiblility,
    showImageMetaViewer,
    showEditorArea,
    showPromptEditor,
  };
}
export type AreaVisiblilityStore = ReturnType<typeof areaVisiblilityStore>;
