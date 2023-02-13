<script setup lang="ts">
import { inject } from "vue";
import SideMenuIcon from "../atoms/SideMenuIcon.vue";
import { AreaVisibilityKey } from "../../store/key";

const areaVisibilityStore = inject(AreaVisibilityKey);
if (!areaVisibilityStore)
  throw new Error("failed to inject store from AreaVisibilityKey");

const showDirectory = () => {
  areaVisibilityStore.changeDirectoryVisibility();
};
const showMetaEditor = () => {
  areaVisibilityStore.changeEditorVisibility();
};
const showImageViewer = () => {
  areaVisibilityStore.changeImageArea();
};
</script>

<template>
  <div class="side-menu">
    <div class="icon-area">
      <SideMenuIcon
        :is-show="areaVisibilityStore.state.showDirectoryArea"
        icon-type="fa-solid fa-folder-open"
        @click="showDirectory"
      ></SideMenuIcon>
      <SideMenuIcon
        :is-show="areaVisibilityStore.state.showEditorArea"
        icon-type="fa-solid fa-terminal"
        @click="showMetaEditor"
      ></SideMenuIcon>
      <SideMenuIcon
        :is-show="areaVisibilityStore.state.showImageArea"
        icon-type="fa-solid fa-list"
        @click="showImageViewer"
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

.side-menu {
  background-color: rgb(73, 73, 73);
  .icon-area {
    display: block;
    padding-top: 8px;
    width: var.$sidebar-width;
    resize: both;
  }
}
</style>
