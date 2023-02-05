<!-- このUIのみ他UIから参照・他UIを参照しています。
再帰コンポーネント実現のためこのようにしています。 -->
<script setup lang="ts">
import { computed, inject, ref } from "vue";
import { DirectoryNode } from "../../core/type/directory";
import { isImageExtension } from "../../core/image";
import DirectoryTrees from "./DirectoryTrees.vue";
import { DirectoryKey } from "../../store/key";

defineProps<{
  node: DirectoryNode;
}>();

const showChild = ref<Boolean>(false);

const switchChildVisible = () => {
  if (showChild.value) {
    showChild.value = false;
  } else {
    showChild.value = true;
  }
};

// store経由でイベントを発火する
const directory = inject(DirectoryKey);
const selectDirectory = (path: string) => {
  directory?.selectDirectory(path);
};

// ディレクトリor画像ファイルであることを確認
const isDirectoryOrImageFile = computed(() => (node: DirectoryNode) => {
  return node.isDirectory || isImageExtension(node.label);
});
</script>

<template>
  <div class="directory-tree">
    <template
      v-if="node.children && node.children.length > 0 && node.isDirectory"
    >
      <!-- childrenが存在する場合はアローを表示 -->
      <div class="filename-area">
        <div class="filename-row">
          <font-awesome-icon
            v-if="!showChild"
            class="arrow-icon"
            icon="fa-solid fa-angle-right"
            @click="switchChildVisible()"
          />
          <font-awesome-icon
            v-else
            class="arrow-icon"
            icon="fa-solid fa-angle-down"
            @click="switchChildVisible()"
          />
          <div class="filename" @click="selectDirectory(node.fullPath)">
            <div>{{ node.label }}</div>
          </div>
        </div>
      </div>
      <template v-if="showChild">
        <div class="child-area">
          <!-- 同じ幅インデントするために不可視の矢印を追加 -->
          <font-awesome-icon
            class="hidden-arrow-icon"
            icon="fa-solid fa-angle-right"
          />
          <DirectoryTrees :nodes="node.children!!"></DirectoryTrees>
        </div>
      </template>
    </template>
    <!-- childrenが存在しない場合はそのまま表示 -->
    <template v-else>
      <!-- ディレクトリ or 画像ファイル以外は表示しない -->
      <template v-if="isDirectoryOrImageFile(node)">
        <div class="filename-area">
          <div class="filename-row">
            <div class="filename">{{ node.label }}</div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.directory-tree {
  font-size: 15px;
  .filename-area {
    display: flex;

    .filename-row {
      display: flex;
      align-items: center;
      user-select: none;
      flex-grow: 1;

      .arrow-icon {
        cursor: pointer;
        flex-grow: 0;
        padding-right: 8px;
      }

      .filename {
        cursor: pointer;
        flex-grow: 1;
        padding-top: 6px;
        padding-bottom: 6px;
        white-space: nowrap;
      }
    }
  }

  .child-area {
    display: flex;
    .hidden-arrow-icon {
      padding-right: 8px;
      visibility: hidden;
    }
  }
}
</style>
