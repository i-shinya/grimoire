<script setup lang="ts">
defineProps<{
  text: string;
  showText: boolean;
}>();
</script>

<template>
  <div class="plus-button clickable">
    <font-awesome-icon class="plus-icon mr-3" icon="fa-solid fa-plus" />
    <p class="shortcut-text" v-if="showText">{{ text }}</p>
  </div>
</template>

<style lang="scss" scoped>
.plus-button {
  width: 100%;
  display: flex;
  border: 1px solid rgb(255, 255, 255);
  padding: 2px;
  justify-content: center;

  .plus-icon {
    height: 13px;
    width: 13px;
    border: 1px solid rgb(255, 255, 255);
    border-radius: 50%;
  }

  .shortcut-text {
    color: rgb(182, 182, 182);
    font-size: 13px;
  }
}
</style>
