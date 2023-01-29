<script setup lang="ts">
import { shell } from "electron";
</script>

<template>
  <div class="image-viewer"></div>
</template>

<style lang="scss" scoped>
.image-viewer {
  width: calc(calc(100vw - 240px - 48px) / 2);
  height: calc(100vh - 20px);
  border-right: 1px black solid;
  background-color: rgb(34, 34, 34);
}
</style>
