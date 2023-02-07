import { reactive } from "vue";

interface PromptState {}

export default function promptStore() {
  const state: PromptState = reactive({});

  return {
    state,
  };
}
export type PromptStore = ReturnType<typeof promptStore>;
