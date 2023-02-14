<script setup lang="ts">
defineProps<{
  isShow: boolean;
  iconType: string;
}>();
</script>

<template>
  <div class="side-menu-icon" :class="isShow ? 'is-show' : ''">
    <font-awesome-icon class="menu-icon" :icon="iconType" />
  </div>
</template>

<style lang="scss" scoped>
$icon-size: 28px;

.side-menu-icon {
  padding: calc(calc(48px - $icon-size) / 2);
  display: block;

  &.is-show {
    .menu-icon {
      height: $icon-size;
      width: $icon-size;
      color: rgb(189, 189, 189) !important;
      cursor: pointer;
    }
  }

  .menu-icon {
    height: $icon-size;
    width: $icon-size;
    color: rgb(112, 112, 112);
    cursor: pointer;
  }
}
</style>
