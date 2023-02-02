<script setup lang="ts">
import { provide } from "vue";
import SideMenu from "./components/SideMenu.vue";
import Footer from "./layout/Footer.vue";
import ImageViewer from "./components/ImageViewer.vue";
import PropertyViewer from "./components/PropertyViewer.vue";
import DirectoryArea from "./components/DirectoryArea.vue";
import directoryStore from "./store/index";
import DirectoryKey from "./store/key";

const dirStore = directoryStore();
provide(DirectoryKey, dirStore);
</script>

<template>
  <div id="app-page">
    <SideMenu></SideMenu>
    <DirectoryArea></DirectoryArea>
    <ImageViewer></ImageViewer>
    <PropertyViewer></PropertyViewer>
    <Footer class="footer"></Footer>
  </div>
</template>

<style lang="scss" scoped>
#app-page {
  display: flex;
  height: 100vh;
  max-height: 100vh;
  width: 100vw;
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
