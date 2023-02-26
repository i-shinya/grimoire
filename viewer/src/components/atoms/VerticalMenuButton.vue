<script setup lang="ts">
defineProps<{
  isShow: boolean;
  text: string;
  iconType: string;
}>();
</script>

<template>
  <div class="vertical-menu-button" :class="isShow ? 'is-show' : ''">
    <font-awesome-icon class="menu-icon mb-2" :icon="iconType" />
    <p class="button-text">{{ text }}</p>
  </div>
</template>

<style lang="scss" scoped>
.vertical-menu-button {
  padding-top: 8px;
  padding-bottom: 8px;
  background-color: #5d5d72;
  cursor: pointer;
  text-align: -webkit-center;
  user-select: none;
  color: #d3d3d3;

  &.is-show {
    background-color: #656579;
    color: #ffffff;
  }

  .menu-icon {
    font-size: 12px;
  }

  .button-text {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    font-size: 15px;
  }
}
</style>
