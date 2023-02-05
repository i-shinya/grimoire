<script setup lang="ts">
import { inject, provide, ref, watch, reactive } from "vue";
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

interface VriableState {
  showPropertyViewer: boolean;
}

const variableState = reactive<VriableState>({
  showPropertyViewer: false,
});

watch(
  () => imgStore!!.state.selectedImageBasePath,
  (state, prevState) => {
    variableState.showPropertyViewer = !!imgStore!!.state.selectedImageBasePath;
  },
  { deep: true }
);
</script>

<template>
  <div id="app-page">
    <Header class="header"></Header>
    <div class="content-area">
      <SideMenu></SideMenu>
      <splitpanes class="size-variable-area">
        <pane min-size="14" size="18">
          <DirectoryArea></DirectoryArea>
        </pane>
        <pane class="viewer-editor-area" size="82">
          <splitpanes>
            <pane>
              <ImageViewer></ImageViewer>
            </pane>
            <pane v-if="variableState.showPropertyViewer" min-size="20">
              <PropertyViewer></PropertyViewer>
            </pane>
          </splitpanes>
        </pane>
      </splitpanes>
    </div>
    <Footer></Footer>
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
    display: flex;
    margin-top: var.$header-height;
    .size-variable-area {
      height: calc(100vh - var.$header-height - var.$footer-height);
      width: calc(100vw - var.$sidebar-width);
    }
  }
}
</style>

<style lang="scss">
@use "./variables.scss" as var;

/* splitpanesのスタイル上書き */
.splitpanes__splitter {
  min-width: 4px !important;
  background: var.$split-bar-color;

  &:hover {
    min-width: 4px !important;
  }
}

/* vuesticのスタイル上書き */
.va-breadcrumbs__separator {
  padding-left: 2px !important;
  padding-right: 4px !important;
}

.va-toast {
  padding-top: 8px !important;
  padding-bottom: 8px !important;
  padding-left: 4px !important;
  padding-right: 4px !important;
}

.va-breadcrumb-item {
  white-space: nowrap;
}
</style>
