<!-- このUIのみ他UIから参照・他UIを参照しています。
再帰コンポーネント実現のためこのようにしています。 -->
<script setup lang="ts">
import { ref } from "vue";
import { DirectoryNode } from "../../core/type/directory";
import DirectoryTrees from "./DirectoryTrees.vue";

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
</script>

<template>
  <div class="directory-tree">
    <template
      v-if="node.children && node.children.length > 0 && node.isDirectory"
    >
      <!-- childrenが存在する場合はアローを表示 -->
      <div class="filename-area">
        <span class="filename">
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
          <p @click="switchChildVisible()">{{ node.label }}</p>
        </span>
      </div>
      <template v-if="showChild">
        <div class="child-area">
          <font-awesome-icon
            class="hidden-arrow-icon"
            icon="fa-solid fa-angle-right"
          />
          <DirectoryTrees :nodes="node.children!!"></DirectoryTrees>
        </div>
      </template>
    </template>
    <template v-else>
      <!-- childrenが存在する場合はそのまま表示 -->
      <div class="filename-area">
        <span class="filename">
          <p>{{ node.label }}</p>
        </span>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.directory-tree {
  font-size: 15px;
  .filename-area {
    display: flex;
    padding-top: 6px;
    padding-bottom: 6px;

    .filename {
      display: flex;
      align-items: center;
      user-select: none;

      .arrow-icon {
        cursor: pointer;
        padding-right: 8px;
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
