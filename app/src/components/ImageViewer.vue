<script setup lang="ts">
import { computed, inject, ref, watch } from "vue";
import DirectoryKey from "../store/key";

const list = [
  { id: 1, label: "name1", path: "" },
  { id: 2, label: "name2", path: "" },
  { id: 3, label: "name3", path: "" },
  { id: 4, label: "name4", path: "" },
  { id: 5, label: "name5", path: "" },
  { id: 6, label: "name6", path: "" },
  { id: 7, label: "name7", path: "" },
  { id: 8, label: "name6", path: "" },
];

const directory = inject(DirectoryKey);
const selectPath = ref<string>("");

watch(
  () => directory!!.state,
  (state, prevState) => {
    console.log("watch");
    selectPath.value = state.selectedDirectoryPath
      ? state.selectedDirectoryPath
      : "";
  },
  { deep: true }
);
</script>

<template>
  <div id="image-viewer">
    <div class="image-viewer">
      <template v-for="item of list" :key="item.id">
        <div class="image-area">
          <va-image src="https://picsum.photos/1500/500" />
          <p class="image-label">{{ item.label }}</p>
        </div>
      </template>
    </div>
    <p>{{ selectPath }}</p>
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
