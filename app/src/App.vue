<script setup lang="ts">
import { provide } from "vue";
import SideMenu from "./components/SideMenu.vue";
import Header from "./layout/Header.vue";
import Footer from "./layout/Footer.vue";
import ImageViewer from "./components/ImageViewer.vue";
import PropertyViewer from "./components/PropertyViewer.vue";
import DirectoryArea from "./components/DirectoryArea.vue";
import directoryStore from "./store/directory";
import imageStore from "./store/image";
import { DirectoryKey, ImageKey } from "./store/key";

const dirStore = directoryStore();
const imgStore = imageStore();
provide(DirectoryKey, dirStore);
provide(ImageKey, imgStore);
</script>

<template>
  <div id="app-page">
    <Header class="header"></Header>
    <SideMenu class="content-area"></SideMenu>
    <DirectoryArea class="content-area"></DirectoryArea>
    <ImageViewer class="content-area"></ImageViewer>
    <PropertyViewer class="content-area"></PropertyViewer>
    <Footer class="footer"></Footer>
  </div>
</template>

<style lang="scss" scoped>
@use "./variables.scss" as var;

#app-page {
  display: flex;
  height: 100vh;
  max-height: 100vh;
  width: 100vw;

  .content-area {
    margin-top: var.$header-height;
  }
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
