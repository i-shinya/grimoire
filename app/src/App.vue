<script setup lang="ts">
import { provide, watch, reactive } from "vue";
import SideMenu from "./components/organisms/SideMenu.vue";
import Header from "./layout/Header.vue";
import Footer from "./layout/Footer.vue";
import ImageViewer from "./components/organisms/ImageViewer.vue";
import PropertyViewer from "./components/organisms/PropertyViewer.vue";
import DirectoryArea from "./components/organisms/DirectoryArea.vue";
import PropertyEditorArea from "./components/organisms/PropertyEditorArea.vue";
import directoryStore from "./store/directory";
import imageStore from "./store/image";
import propertyStore from "./store/property";
import { DirectoryKey, ImageKey, PropertyKey } from "./store/key";

const dirStore = directoryStore();
const imgStore = imageStore();
const propStore = propertyStore();
provide(DirectoryKey, dirStore);
provide(ImageKey, imgStore);
provide(PropertyKey, propStore);

interface VriableState {
  showDirectory: boolean;
  showPropertyViewer: boolean;
  showEditor: boolean;
}

const variableState = reactive<VriableState>({
  showDirectory: true,
  showPropertyViewer: false,
  showEditor: false,
});

watch(
  () => imgStore!!.state,
  (state, prevState) => {
    variableState.showPropertyViewer = !!state.selectedImageBasePath;
  },
  { deep: true }
);

const showDirectory = () => {
  variableState.showDirectory = !variableState.showDirectory;
};

const showEditor = () => {
  variableState.showEditor = !variableState.showEditor;
};
</script>

<template>
  <div id="app-page">
    <Header class="header"></Header>
    <div class="content-area">
      <SideMenu
        @show-editor="showEditor"
        @show-derectory="showDirectory"
      ></SideMenu>
      <splitpanes class="size-variable-area">
        <pane v-if="variableState.showDirectory" min-size="14" size="18">
          <DirectoryArea></DirectoryArea>
        </pane>
        <pane>
          <splitpanes horizontal>
            <pane v-if="variableState.showEditor" size="45">
              <PropertyEditorArea></PropertyEditorArea>
            </pane>
            <pane>
              <splitpanes>
                <pane min-size="20">
                  <ImageViewer></ImageViewer>
                </pane>
                <pane v-if="variableState.showPropertyViewer" min-size="20">
                  <PropertyViewer></PropertyViewer>
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
  padding-top: 8px !important;
  padding-bottom: 8px !important;
  padding-left: 4px !important;
  padding-right: 4px !important;
}

.va-breadcrumb-item {
  white-space: nowrap;
}
</style>
