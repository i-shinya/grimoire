<script setup lang="ts">
import { computed, inject, ref, watch } from "vue";
import { DirectoryKey, ImageKey } from "../../store/key";
import { ImageDetail } from "../../core/type/image";
import BreadCrumbs, { Bread } from "../molecules/BreadCrumbs.vue";

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
  imageStore!!.selectImage(selectPath.value, image);
};

const isSelected = computed(() => (image: ImageDetail): boolean => {
  return (
    image.id === imageStore?.state.imageDetail?.id &&
    selectPath.value === imageStore?.state.selectedImageBasePath
  );
});
</script>

<template>
  <div id="image-viewer">
    <BreadCrumbs class="breads" :breads="breads"></BreadCrumbs>
    <div class="image-viewer">
      <template v-for="item of images" :key="item.id">
        <div class="image-area" @click="selectImage(item)">
          <div :class="isSelected(item) ? 'is-selected-image' : ''">
            <va-image :src="item.dataUrl" :contain="true" :ratio="0.75" />
          </div>
          <div class="image-label">{{ item.label }}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../../variables.scss" as var;

#image-viewer {
  height: 100%;
  width: 100%;
  border-right: 1px black solid;
  background-color: rgb(34, 34, 34);
  overflow: auto;
  padding: 16px;

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

      .is-selected-image {
        border: 2px solid rgb(150, 161, 109);
      }
      .image-label {
        padding-top: 4px;
        font-size: 16px;
        text-align: center;
      }
    }
  }
}
</style>
