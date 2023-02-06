<script setup lang="ts">
import { emit } from "process";
import SideMenuIcon from "../atoms/SideMenuIcon.vue";

const emits = defineEmits<{
  (e: "show-derectory"): void;
  (e: "show-editor"): void;
}>();

const showDirectory = () => {
  emits("show-derectory");
};
const showEditor = () => {
  emits("show-editor");
};
</script>

<template>
  <div class="sidemenu">
    <div class="icon-area">
      <SideMenuIcon
        icon-type="fa-solid fa-folder-open"
        @click="showDirectory"
      ></SideMenuIcon>
      <SideMenuIcon
        icon-type="fa-solid fa-terminal"
        @click="showEditor"
      ></SideMenuIcon>
      <!-- 検索機能が欲しくなったら実装してください -->
      <!-- <SideMenuIcon
        icon-type="fa-solid fa-magnifying-glass"
        @click="searchDirectroy"
      ></SideMenuIcon> -->
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
