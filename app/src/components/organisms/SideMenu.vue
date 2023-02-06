<script setup lang="ts">
import SideMenuIcon from "../atoms/SideMenuIcon.vue";

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
@use "../../variables.scss" as var;

.sidemenu {
  background-color: rgb(73, 73, 73);
  .icon-area {
    display: block;
    padding-top: 8px;
    width: var.$sidebar-width;
    resize: both;
  }
}
</style>
