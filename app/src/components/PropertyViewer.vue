<script setup lang="ts">
import { inject, ref, watch } from "vue";
import { ImageKey } from "../store/key";
import { ImageDetail } from "../core/type/image";
import Property from "./ui/Property.vue";
import BreadCrumbs, { Bread } from "./ui/BreadCrumbs.vue";

const imageStore = inject(ImageKey);

const basePath = ref<string>("");
const properties = ref<ImageDetail | null>(null);
const breads = ref<Bread[]>([]);

watch(
  () => imageStore!!.state,
  (state, prevState) => {
    basePath.value = state.selectedImageBasePath ?? "";
    properties.value = state.imageDetail ?? null;

    breads.value = basePath.value.split("/").map((val, index) => {
      return { id: index, text: val };
    });
    breads.value.push({
      id: breads.value.length,
      text: properties.value?.label ?? "",
    });
  },
  { deep: true }
);
</script>

<template>
  <div id="property-viewer">
    <div class="property-viewer" v-if="properties">
      <BreadCrumbs class="breads" :breads="breads"></BreadCrumbs>
      <div class="property-area">
        <Property label="positive" :value="properties.meta.positive"></Property>
        <Property label="negative" :value="properties.meta.negative"></Property>
        <Property label="steps" :value="properties.meta.steps"></Property>
        <Property label="sampler" :value="properties.meta.sampler"></Property>
        <Property label="seed" :value="properties.meta.seed"></Property>
        <Property label="strength" :value="properties.meta.strength"></Property>
        <Property label="noise" :value="properties.meta.noise"></Property>
        <Property label="scale" :value="properties.meta.scale"></Property>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../variables.scss" as var;

#property-viewer {
  width: calc(calc(100vw - 240px - 48px) / 2);
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
    .property-area {
    }
  }
}
</style>
