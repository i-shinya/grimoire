<script setup lang="ts">
import { inject, ref, watch } from "vue";
import { DirectoryKey, ImageKey } from "../store/key";
import { ImageDetail } from "../core/type/image";
import BreadCrumbs, { Bread } from "./ui/BreadCrumbs.vue";

const directoryStore = inject(DirectoryKey);
const imageStore = inject(ImageKey);

const selectPath = ref<string>("");
const images = ref<ImageDetail[]>([]);
const breads = ref<Bread[]>([]);

watch(
  () => directoryStore!!.state,
  (state, prevState) => {
    selectPath.value = state.selectedDirectoryPath ?? "";
    images.value = state.imageDetails ?? [];
    breads.value = selectPath.value.split("/").map((val, index) => {
      return { id: index, text: val };
    });
  },
  { deep: true }
);

const selectImage = (image: ImageDetail) => {
  imageStore!!.selectDirectory(selectPath.value, image);
};
</script>

<template>
  <div id="image-viewer">
    <BreadCrumbs class="breads" :breads="breads"></BreadCrumbs>
    <div class="image-viewer">
      <template v-for="item of images" :key="item.id">
        <div class="image-area" @click="selectImage(item)">
          <va-image :src="item.dataUrl" />
          <p class="image-label">{{ item.label }}</p>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#image-viewer {
  width: calc(calc(100vw - 240px - 48px) / 2);
  height: calc(100vh - 20px);
  border-right: 1px black solid;
  background-color: rgb(34, 34, 34);
  overflow: auto;
  padding: 16px;

  /* スクロール幅 */
  &::-webkit-scrollbar {
    width: 8px;
    height: 10px;
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

  .breads {
    margin-bottom: 20px;
  }

  .image-viewer {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-wrap: wrap;

    .image-area {
      color: white;
      max-width: 30%;
      min-width: 200px;
      max-height: 30%;
      padding: 8px;
      cursor: pointer;

      .image-label {
        padding-top: 4px;
        font-size: 18px;
        text-align: center;
      }
    }
  }
}
</style>
