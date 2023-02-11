<script setup lang="ts">
import { inject } from "vue";
import SideMenuIcon from "../atoms/SideMenuIcon.vue";
import { AreaVisibilityKey } from "../../store/key";

const areaVisiblityStore = inject(AreaVisibilityKey);
if (!areaVisiblityStore)
  throw new Error("failed to inejct store from AreaVisibilityKey");

const showDirectory = () => {
  areaVisiblityStore.changeDirectoryVisiblity();
};
const showMetaEditor = () => {
  areaVisiblityStore.changeEditorVisiblity();
};
const showImageViewer = () => {
  areaVisiblityStore.changeImageArea();
};
</script>

<template>
  <div class="sidemenu">
    <div class="icon-area">
      <SideMenuIcon
        :is-show="areaVisiblityStore.state.showDirectoryArea"
        icon-type="fa-solid fa-folder-open"
        @click="showDirectory"
      ></SideMenuIcon>
      <SideMenuIcon
        :is-show="areaVisiblityStore.state.showEditorArea"
        icon-type="fa-solid fa-terminal"
        @click="showMetaEditor"
      ></SideMenuIcon>
      <SideMenuIcon
        :is-show="areaVisiblityStore.state.showImageArea"
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
