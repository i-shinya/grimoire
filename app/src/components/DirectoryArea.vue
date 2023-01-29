<script setup lang="ts">
import { ipcRenderer } from "electron";
import path from "path";
import { ref } from "vue";

// 選択しているディレクトリのベースパス
const basedir = ref<string | null>(null);
// 選択しているディレクトリ名
const directroyName = ref<string | null>(null);

const openDirectory = async () => {
  const text = await ipcRenderer.invoke("open-direcroty-dialog");
  if (text === "") {
    return;
  }
  basedir.value = path.dirname(text);
  directroyName.value = path.basename(text);
};

const nodes = [
  {
    id: 1,
    label: "Action",
    children: [
      { id: 2, label: "Platform games" },
      { id: 3, label: "Shooter games" },
      { id: 4, label: "Fighting games" },
    ],
  },
  {
    id: 9,
    label: "Puzzle",
    children: [
      { id: 10, label: "Breakout clone game" },
      {
        id: 11,
        label: "Logical game",
        children: [{ id: 12, label: "Physics game" }],
      },
    ],
  },
  { id: 13, label: "Simulation" },
];
</script>

<template>
  <div class="directroy-area">
    <div class="directory-button-area row justify-center">
      <va-button size="medium" class="directory-button" @click="openDirectory"
        >Open Directory</va-button
      >
    </div>
    <div class="tree-area" v-if="directroyName">
      <p class="directory-name">{{ directroyName }}</p>
      <va-tree-view :nodes="nodes" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.directroy-area {
  height: calc(100vh - 20px);
  width: 240px;
  background-color: rgb(48, 48, 48);

  .directory-button-area {
    padding-top: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgb(124, 124, 124);
  }

  .tree-area {
    padding-top: 8px;
    color: rgb(221, 221, 221);

    .directory-name {
      padding-left: 8px;
      font-weight: bold;
    }
  }
}
</style>
