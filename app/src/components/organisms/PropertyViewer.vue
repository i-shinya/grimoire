<script setup lang="ts">
import { inject, ref, watch } from "vue";
import { ImageKey, PropertyKey } from "../../store/key";
import { ImageDetail } from "../../core/type/image";
import Property from "../atoms/Property.vue";
import BreadCrumbs, { Bread } from "../molecules/BreadCrumbs.vue";
import { onMounted } from "vue";
import { ImageState } from "../../store/image";

const imageStore = inject(ImageKey);
const propertyStore = inject(PropertyKey);

const basePath = ref<string>("");
const properties = ref<ImageDetail | null>(null);
const breads = ref<Bread[]>([]);

const setProperty = (state: ImageState) => {
  basePath.value = state.selectedImageBasePath ?? "";
  properties.value = state.imageDetail ?? null;

  breads.value = basePath.value.split("/").map((val, index) => {
    return { id: index, text: val };
  });
  breads.value.push({
    id: breads.value.length,
    text: properties.value?.label ?? "",
  });
};

watch(
  () => imageStore!!.state,
  (state, prevState) => {
    setProperty(state);
  },
  { deep: true }
);

onMounted(() => {
  const state = imageStore?.state;
  if (!state) {
    return;
  }
  setProperty(state);
});
</script>

<template>
  <div id="property-viewer">
    <div class="property-viewer" v-if="properties">
      <BreadCrumbs class="breads" :breads="breads"></BreadCrumbs>
      <div class="property-area">
        <Property
          label="Positive Prompt"
          :value="properties.meta.positive"
        ></Property>
        <Property
          label="Negative Prompt"
          :value="properties.meta.negative"
        ></Property>
        <Property label="Steps" :value="properties.meta.steps"></Property>
        <Property label="Scale" :value="properties.meta.scale"></Property>
        <Property label="Seed" :value="properties.meta.seed"></Property>
        <Property label="Sampler" :value="properties.meta.sampler"></Property>
        <Property label="Strength" :value="properties.meta.strength"></Property>
        <Property label="Noise" :value="properties.meta.noise"></Property>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../../variables.scss" as var;

#property-viewer {
  height: 100%;
  width: 100%;
  background-color: rgb(34, 34, 34);
  padding: 16px;
  overflow: auto;

  /* スクロール幅 */
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  /* スクロール背景 */
  &::-webkit-scrollbar-track {
    border-radius: 5px;
    background: rgba(110, 108, 108, 0.2);
  }
  /* ドラック部 */
  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: #c2c2c2;
  }

  .property-viewer {
    .breads {
      margin-bottom: 20px;
    }
  }
}
</style>
