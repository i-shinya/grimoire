<script setup lang="ts">
import { ref } from "vue";
import { getDirectroyName, getBaseDirName } from "../../core/path";
import { DirectoryNode } from "../../core/type/directory";
import DirectoryTree from "../molecules/directory-tree/DirectoryTrees.vue";

// 選択しているディレクトリのベースパス
const baseDir = ref<string | null>(null);
// 選択しているディレクトリ名
const directroyName = ref<string | null>(null);
// 選択しているディレクトリのフルパス
const directroyFullPath = ref<string | null>(null);

const directoryNodes = ref<DirectoryNode[]>([]);

const openDirectory = async () => {
  // FIXME vscode上でglobal.d.tsの型定義が上手く読めないのでas anyにしている。そのうち修正したい
  const path: string = await (window as any).direcrotyAPI.openDialog();
  if (!path) {
    return;
  }
  directroyFullPath.value = path;
  directroyName.value = getDirectroyName(path)!!;
  baseDir.value = getBaseDirName(path)!!;

  const res: DirectoryNode[] = await (
    window as any
  ).direcrotyAPI.showDirectories(path);
  directoryNodes.value = res;
};
</script>

<template>
  <div class="directroy-area">
    <div class="directory-button-area row justify-center">
      <va-button size="medium" class="directory-button" @click="openDirectory"
        >Open Directory</va-button
      >
    </div>
    <div class="tree-area" v-if="directroyName">
      <div class="select-directory">
        <p class="directory-name">{{ directroyName }}</p>
        <p class="basedir-name">{{ baseDir }}</p>
      </div>
      <div class="directory-tree-area">
        <DirectoryTree :nodes="directoryNodes!!"></DirectoryTree>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../../variables.scss" as var;

$button-area-height: 70px;
$select-directroy-area-height: 30px;

.directroy-area {
  height: 100%;
  width: 100%;
  background-color: rgb(48, 48, 48);
  overflow-x: auto;
  overflow-y: hidden;

  .directory-button-area {
    height: $button-area-height;
    padding-top: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid var.$split-bar-color;
  }

  .tree-area {
    padding-top: 8px;
    color: rgb(231, 231, 231);

    .select-directory {
      width: 100%;
      height: $select-directroy-area-height;
      display: flex;
      align-items: center;
      font-size: 14px;
      padding-bottom: 8px;
      padding-left: 8px;
      padding-right: 8px;
      border-bottom: 1px solid var.$split-bar-color;
      overflow-y: auto;

      /* スクロール幅 */
      &::-webkit-scrollbar {
        width: 2px;
        height: 2px;
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

      &:hover {
        /* スクロール幅 */
        &::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
      }

      .directory-name {
        font-weight: bold;
      }

      .basedir-name {
        padding-left: 8px;
        font-size: 12px;
        color: rgb(161, 161, 161);
      }
    }

    .directory-tree-area {
      padding-left: 16px;
      // 8pxはスクロールバーの分
      height: calc(
        100vh - var.$header-height - var.$footer-height -
          $select-directroy-area-height - $button-area-height - 8px
      );
      font-size: 14px;
      padding-top: 8px;
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
    }
  }
}
</style>
