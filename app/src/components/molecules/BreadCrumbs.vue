<script setup lang="ts">
export interface Bread {
  id: number;
  text: string;
}

defineProps<{
  breads: Bread[];
}>();
</script>

<template>
  <div id="breadcrumbs">
    <va-breadcrumbs separator=">" class="breadcrumbs mb-6">
      <template v-for="bread of breads" :key="bread.id">
        <va-breadcrumbs-item :label="bread.text" />
      </template>
    </va-breadcrumbs>
  </div>
</template>

<style lang="scss" scoped>
@use "../../variables.scss" as var;

.breadcrumbs {
  font-size: 14px;
  padding-bottom: 6px;
  width: 100%;
  overflow-x: auto;
  height: var.$bread-crumbs-height;
  color: rgb(240, 240, 240);

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
}
</style>
