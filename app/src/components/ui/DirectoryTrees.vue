<script setup lang="ts">
import { DirectoryNode } from "../../core/path";
import DirectoryTree from "./DirectoryTree.vue";

defineProps<{
  nodes: DirectoryNode[];
}>();
</script>

<template>
  <div class="directory-tree">
    <template v-for="node in nodes" :key="node.id">
      <DirectoryTree :node="node"></DirectoryTree>
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
