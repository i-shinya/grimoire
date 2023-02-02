import { reactive } from "vue";

interface DirectoryState {
  selectedDirectoryPath: string | null;
}

export default function directoryStore() {
  const state: DirectoryState = reactive({
    selectedDirectoryPath: null,
  });

  const selectDirectory = (path: string) => {
    state.selectedDirectoryPath = path;
  };

  return {
    state,
    selectDirectory,
  };
}
export type DirectoryStore = ReturnType<typeof directoryStore>;
