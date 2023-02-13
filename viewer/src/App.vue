<script setup lang="ts">
import { provide } from "vue";
import SideMenu from "./components/organisms/SideMenu.vue";
import Header from "./layout/Header.vue";
import Footer from "./layout/Footer.vue";
import ImageViewer from "./components/organisms/ImageViewer.vue";
import ImageMetaViewer from "./components/organisms/ImageMetaViewer.vue";
import DirectoryArea from "./components/organisms/DirectoryArea.vue";
import MetaEditorArea from "./components/organisms/MetaEditorArea.vue";
import directoryStore from "./store/directory";
import imageStore from "./store/image";
import propertyStore from "./store/property";
import areaVisibilityStore from "./store/area-visibility";
import {
  AreaVisibilityKey,
  DirectoryKey,
  ImageKey,
  PropertyKey,
} from "./store/key";
import PromptEditorArea from "./components/organisms/PromptEditorArea.vue";

const dirStore = directoryStore();
const imgStore = imageStore();
const propStore = propertyStore();
const areaVisibleStore = areaVisibilityStore();
provide(DirectoryKey, dirStore);
provide(ImageKey, imgStore);
provide(PropertyKey, propStore);
provide(AreaVisibilityKey, areaVisibleStore);
</script>

<template>
  <div id="app-page">
    <Header class="header"></Header>
    <div class="content-area">
      <SideMenu></SideMenu>
      <splitpanes class="size-variable-area">
        <pane
          v-if="areaVisibleStore.state.showDirectoryArea"
          min-size="10"
          size="14"
        >
          <DirectoryArea></DirectoryArea>
        </pane>
        <pane>
          <splitpanes horizontal>
            <pane v-if="areaVisibleStore.state.showEditorArea" size="45">
              <splitpanes>
                <pane size="40" min-size="20">
                  <MetaEditorArea></MetaEditorArea>
                </pane>
                <pane
                  v-if="areaVisibleStore.state.showPromptEditor"
                  min-size="20"
                >
                  <PromptEditorArea></PromptEditorArea>
                </pane>
              </splitpanes>
            </pane>
            <pane v-if="areaVisibleStore.state.showImageArea">
              <splitpanes>
                <pane min-size="20" size="60">
                  <ImageViewer></ImageViewer>
                </pane>
                <pane
                  v-if="areaVisibleStore.state.showImageMetaViewer"
                  min-size="20"
                  size="40"
                >
                  <ImageMetaViewer></ImageMetaViewer>
                </pane>
              </splitpanes>
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
  background-color: rgb(34, 34, 34);

  .content-area {
    display: flex;
    margin-top: var.$header-height;
    .size-variable-area {
      height: calc(100vh - #{var.$header-height} - #{var.$footer-height});
      width: calc(100vw - #{var.$sidebar-width});
    }
  }
}
</style>

<style lang="scss">
@use "./variables.scss" as var;

.clickable {
  cursor: pointer;
}

/* splitpanesのスタイル上書き */
.splitpanes__splitter {
  min-width: 3px !important;
  min-height: 3px !important;
  background: var.$split-bar-color;

  &:hover {
    min-width: 3px !important;
  }
}

/* vuesticのスタイル上書き */
.va-breadcrumbs__separator {
  padding-left: 2px !important;
  padding-right: 4px !important;
}

.va-toast {
  padding: 2px !important;
  border-radius: 0 !important;
}

.va-breadcrumb-item {
  white-space: nowrap;
}
</style>