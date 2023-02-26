<script setup lang="ts">
import { inject } from "vue";
import { AreaVisibilityKey } from "../../store/key";

const areaVisibilityStore = inject(AreaVisibilityKey);
if (!areaVisibilityStore) {
  throw new Error("failed to inject store from AreaVisibilityKey");
}
</script>

<template>
  <div class="right-side-area"></div>
</template>

<style lang="scss" scoped>
.right-side-area {
  height: 100%;
  width: 240px;
  background-color: rgb(48, 48, 48);
  overflow-x: auto;
  overflow-y: auto;
}
</style>
