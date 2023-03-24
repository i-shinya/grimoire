<script setup lang="ts">
import { computed, inject } from "vue";
import { AreaVisibilityKey, ImageKey, PropertyKey } from "../../store/key";
import Property from "../atoms/Property.vue";
import BreadCrumbs, { Bread } from "../molecules/BreadCrumbs.vue";

const imageStore = inject(ImageKey);
if (!imageStore) throw new Error("failed to inject store from ImageKey");
const propertyStore = inject(PropertyKey);
if (!propertyStore) throw new Error("failed to inject store from PropertyKey");
const areaVisibilityStore = inject(AreaVisibilityKey);
if (!areaVisibilityStore)
  throw new Error("failed to inject store from AreaVisibilityKey");

const basePath = computed(() => imageStore.state.selectedImageBasePath ?? "");
const imageDetail = computed(() => imageStore.state.imageDetail ?? null);
const breads = computed(() => {
  let result = basePath.value.split("/").map((val, index) => {
    return { id: index, text: val };
  });
  result.push({
    id: result.length,
    text: imageDetail.value?.label ?? "",
  });
  return result;
});

const copyToEditor = () => {
  if (imageDetail.value?.meta) {
    propertyStore.copyProperty(imageDetail.value.meta);
    areaVisibilityStore.showEditorArea();
  }
};
</script>

<template>
  <div id="image-meta-viewer">
    <div class="image-meta-viewer" v-if="imageDetail">
      <div class="sticky-area pt-3 mb-4">
        <BreadCrumbs class="mb-4" :breads="breads"></BreadCrumbs>
        <div class="copy-button" @click="copyToEditor">
          <font-awesome-icon
            class="copy-to-editor-icon mr-2"
            icon="fa-regular fa-circle-up"
          />
          <div>Copy to Editor</div>
        </div>
      </div>
      <div class="meta-area" v-if="imageDetail.meta">
        <Property
          class="mb-3"
          label="Provider"
          :shortcutText="null"
          :value="imageDetail.meta.provider ?? 'sorry, unknown...'"
        ></Property>
        <Property
          class="mb-3"
          label="Model"
          :shortcutText="null"
          :value="imageDetail.meta.model"
          v-if="imageDetail.meta.model"
        ></Property>
        <Property
          class="mb-3"
          label="Sampler"
          :shortcutText="null"
          :value="imageDetail.meta.sampler"
          v-if="imageDetail.meta.sampler"
        ></Property>
        <Property
          class="mb-3"
          label="Size (Width x Height)"
          :shortcutText="null"
          :value="`${imageDetail.meta.width} x ${imageDetail.meta.height}`"
          v-if="imageDetail.meta.width"
        ></Property>
        <Property
          class="mb-3"
          label="Positive Prompt"
          :shortcutText="null"
          :value="imageDetail.meta.positive ?? ''"
        ></Property>
        <Property
          class="mb-3"
          label="Negative Prompt"
          :shortcutText="null"
          :value="imageDetail.meta.negative ?? ''"
        ></Property>
        <Property
          class="mb-3"
          label="Steps"
          :shortcutText="null"
          :value="imageDetail.meta.steps"
          v-if="imageDetail.meta.steps"
        ></Property>
        <Property
          class="mb-3"
          label="Scale"
          :shortcutText="null"
          :value="imageDetail.meta.scale"
          v-if="imageDetail.meta.scale"
        ></Property>
        <Property
          class="mb-3"
          label="Seed"
          :shortcutText="null"
          :value="imageDetail.meta.seed"
          v-if="imageDetail.meta.seed"
        ></Property>
        <Property
          class="mb-3"
          label="Strength"
          :shortcutText="null"
          :value="imageDetail.meta.strength"
          v-if="imageDetail.meta.strength"
        ></Property>
        <Property
          class="mb-3"
          label="Noise"
          :shortcutText="null"
          :value="imageDetail.meta.noise"
          v-if="imageDetail.meta.noise"
        ></Property>
        <Property
          class="mb-3"
          label="Other Properties"
          :shortcutText="null"
          :value="imageDetail.meta.other"
          v-if="imageDetail.meta.other"
        ></Property>
      </div>
      <div class="no-meta-area" v-else>
        <font-awesome-icon class="no-meta-icon mr-3" icon="fa-solid fa-ban" />
        <p class="no-meta-text">no metadata</p>
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
  padding: 0 12px 12px 12px;
  overflow: auto;
  position: relative;

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
    .sticky-area {
      position: sticky;
      top: 0;
      background-color: rgb(34, 34, 34);

      .copy-button {
        display: flex;
        border: 1px solid rgb(255, 255, 255);
        padding: 4px;
        cursor: pointer;
        justify-content: center;
        background-color: rgb(37, 18, 18);
      }
    }

    .meta-area {
    }

    .no-meta-area {
      display: flex;
      justify-content: center;

      .no-meta-icon {
        font-size: 18px;
        color: #ae2121;
      }

      .no-meta-text {
        font-size: 18px;
        font-weight: bold;
        color: #ae2121;
      }
    }
  }
}
</style>
