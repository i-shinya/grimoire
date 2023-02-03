<script setup lang="ts">
import { inject, ref, watch } from "vue";
import DirectoryKey from "../store/key";
import { ImageDetail } from "../core/type/image";

const directory = inject(DirectoryKey);
const selectPath = ref<string>("");
const images = ref<ImageDetail[]>([]);

watch(
  () => directory!!.state,
  (state, prevState) => {
    selectPath.value = state.selectedDirectoryPath
      ? state.selectedDirectoryPath
      : "";
    images.value = state.imageDetails ? state.imageDetails : [];
  },
  { deep: true }
);
</script>

<template>
  <div id="image-viewer">
    <p>{{ selectPath }}</p>
    <div class="image-viewer">
      <template v-for="item of images" :key="item.id">
        <div class="image-area">
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

  .image-viewer {
    padding: 16px;
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

      .image-label {
        padding-top: 4px;
        font-size: 18px;
        text-align: center;
      }
    }
  }
}
</style>
