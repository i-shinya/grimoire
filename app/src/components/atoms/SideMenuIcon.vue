<script setup lang="ts">
defineProps<{
  iconType: string;
}>();
</script>

<template>
  <div class="side-menu-icon">
    <font-awesome-icon class="menu-icon" :icon="iconType" />
  </div>
</template>

<style lang="scss" scoped>
$icon-size: 28px;

.side-menu-icon {
  padding: calc(calc(48px - $icon-size) / 2);
  display: block;

  .menu-icon {
    height: $icon-size;
    width: $icon-size;
    color: rgb(112, 112, 112);
    cursor: pointer;
  }
}
</style>
