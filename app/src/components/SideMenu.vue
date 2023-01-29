<script setup lang="ts">
import SideMenuIcon from "./ui/SideMenuIcon.vue";

const showDirectory = () => {};
const searchDirectroy = () => {};
</script>

<template>
  <div class="sidemenu">
    <div class="icon-area">
      <SideMenuIcon
        icon-type="fa-solid fa-folder-open"
        @click="showDirectory"
      ></SideMenuIcon>
      <SideMenuIcon
        icon-type="fa-solid fa-magnifying-glass"
        @click="searchDirectroy"
      ></SideMenuIcon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sidemenu {
  .icon-area {
    display: block;
    padding-top: 8px;
    height: calc(100vh - 20px);
    width: 48px;
    background-color: rgb(73, 73, 73);
    resize: both;
  }
}
</style>
