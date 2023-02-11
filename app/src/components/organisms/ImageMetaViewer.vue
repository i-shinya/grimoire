<script setup lang="ts">
import { inject, ref, watch } from "vue";
import { AreaVisibilityKey, ImageKey, PropertyKey } from "../../store/key";
import { ImageDetail } from "../../core/type/image";
import Property from "../atoms/Property.vue";
import BreadCrumbs, { Bread } from "../molecules/BreadCrumbs.vue";
import { onMounted } from "vue";
import { ImageState } from "../../store/image";

const imageStore = inject(ImageKey);
if (!imageStore) throw new Error("failed to inejct store from ImageKey");
const propertyStore = inject(PropertyKey);
if (!propertyStore) throw new Error("failed to inejct store from PropertyKey");
const areaVisiblityStore = inject(AreaVisibilityKey);
if (!areaVisiblityStore)
  throw new Error("failed to inejct store from AreaVisibilityKey");

const basePath = ref<string>("");
const imageDetail = ref<ImageDetail | null>(null);
const breads = ref<Bread[]>([]);

const setProperty = (state: ImageState) => {
  basePath.value = state.selectedImageBasePath ?? "";
  imageDetail.value = state.imageDetail ?? null;

  breads.value = basePath.value.split("/").map((val, index) => {
    return { id: index, text: val };
  });
  breads.value.push({
    id: breads.value.length,
    text: imageDetail.value?.label ?? "",
  });
};

const copyToEditor = () => {
  if (imageDetail.value?.meta) {
    propertyStore.copyProperty(imageDetail.value.meta);
    areaVisiblityStore.showEditorArea();
  }
};

onMounted(() => {
  const state = imageStore.state;
  setProperty(state);
});
watch(
  () => imageStore.state,
  (state, prevState) => {
    setProperty(state);
  },
  { deep: true }
);
</script>

<template>
  <div id="image-meta-viewer">
    <div class="image-meta-viewer" v-if="imageDetail">
      <BreadCrumbs class="breads" :breads="breads"></BreadCrumbs>
      <div class="meta-area">
        <div class="copy-button mb-4" @click="copyToEditor">
          <font-awesome-icon
            class="copy-to-edittor-icon mr-2"
            icon="fa-regular fa-circle-up"
          />
          <div>Copy to Editor</div>
        </div>
        <Property
          class="mb-4"
          label="Positive Prompt"
          :shortcutText="null"
          :value="imageDetail.meta.positive"
        ></Property>
        <Property
          class="mb-4"
          label="Negative Prompt"
          :shortcutText="null"
          :value="imageDetail.meta.negative"
        ></Property>
        <Property
          class="mb-4"
          label="Steps"
          :shortcutText="null"
          :value="imageDetail.meta.steps"
        ></Property>
        <Property
          class="mb-4"
          label="Scale"
          :shortcutText="null"
          :value="imageDetail.meta.scale"
        ></Property>
        <Property
          class="mb-4"
          label="Seed"
          :shortcutText="null"
          :value="imageDetail.meta.seed"
        ></Property>
        <Property
          class="mb-4"
          label="Sampler"
          :shortcutText="null"
          :value="imageDetail.meta.sampler"
        ></Property>
        <Property
          class="mb-4"
          label="Strength"
          :shortcutText="null"
          :value="imageDetail.meta.strength"
        ></Property>
        <Property
          class="mb-4"
          label="Noise"
          :shortcutText="null"
          :value="imageDetail.meta.noise"
        ></Property>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../../variables.scss" as var;

#image-meta-viewer {
  height: 100%;
  width: 100%;
  background-color: rgb(34, 34, 34);
  padding: 12px;
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

  .image-meta-viewer {
    .breads {
      margin-bottom: 20px;
    }

    .meta-area {
      .copy-button {
        display: flex;
        border: 1px solid rgb(255, 255, 255);
        padding: 4px;
        cursor: pointer;
        justify-content: center;
        background-color: rgb(37, 18, 18);
      }
    }
  }
}
</style>
