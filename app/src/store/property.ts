import { reactive } from "vue";
import { Metadata } from "../core/type/image";

interface PropertyState {
  meta: Metadata;
}

export default function propertyStore() {
  const state: PropertyState = reactive({
    meta: new Metadata(),
  });

  // ディレクトリツリーで選択
  const copyProperty = (meta: Metadata) => {
    state.meta = meta;
  };

  const setValue = (val: { label: string; value: string }) => {
    if (val.label === "Positive Prompt") {
      state.meta.positive = val.value;
    } else if (val.label === "Negative Prompt") {
      state.meta.negative = val.value;
    } else if (val.label === "Negative Prompt") {
      state.meta.steps = val.value;
    } else if (val.label === "Scale") {
      state.meta.scale = val.value;
    } else if (val.label === "Seed") {
      state.meta.seed = val.value;
    } else if (val.label === "Sampler") {
      state.meta.sampler = val.value;
    } else if (val.label === "Strength") {
      state.meta.strength = val.value;
    } else if (val.label === "Noise") {
      state.meta.noise = val.value;
    }
  };

  return {
    state,
    copyProperty,
    setValue,
  };
}
export type PropertyStore = ReturnType<typeof propertyStore>;
