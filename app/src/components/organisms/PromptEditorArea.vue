<script setup lang="ts">
// TODO プロンプトエディター実装
</script>

<template>
  <div id="prompt-editor-area"></div>
</template>

<style lang="scss" scoped>
@use "../../variables.scss" as var;

#prompt-editor-area {
  height: 100%;
  width: 100%;
  background-color: rgb(37, 18, 18);
  padding: 16px;
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
    background: #acb2c7;
  }
}
</style>
