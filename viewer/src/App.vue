<script setup lang="ts">
import { inject, onMounted, provide } from "vue";
import SideMenu from "./layout/SideMenu.vue";
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
  FavoritePromptKey,
  ImageKey,
  PropertyKey,
} from "./store/key";
import PromptEditorArea from "./components/organisms/PromptEditorArea.vue";
import RightSideMenu from "./layout/RightSideMenu.vue";
import RightSideArea from "./components/organisms/RightSideArea.vue";
import favoritePromptState from "./store/favorite-prompt";
import { StoreAPIKey } from "./core/api/store";

const dirStore = directoryStore();
const imgStore = imageStore();
const propStore = propertyStore();
const areaVisibleStore = areaVisibilityStore();
const favoriteStore = favoritePromptState();
provide(DirectoryKey, dirStore);
provide(ImageKey, imgStore);
provide(PropertyKey, propStore);
provide(AreaVisibilityKey, areaVisibleStore);
provide(FavoritePromptKey, favoriteStore);

const storeAPI = inject(StoreAPIKey);
if (!storeAPI) {
  throw new Error("failed to inject storeAPI from StoreAPIKey");
}

onMounted(async () => {
  // configを呼び出す処理
  storeAPI.getFavoritePrompt().then((res) => {
    favoriteStore.setFavoritePrompt(res);
  });
  storeAPI.getThumbnailSize().then((res) => {
    imgStore.setThumbnailSize(res);
  });
});
</script>

<template>
  <div id="app-page">
    <va-inner-loading
      class="loading-area"
      :loading="areaVisibleStore.state.showLoading"
    >
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
            <splitpanes>
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
                  <pane v-if="true">
                    <splitpanes>
                      <pane min-size="20" size="60">
                        <ImageViewer></ImageViewer>
                      </pane>
                      <!--画像選択した時に一覧が動くのうざかったから常に表示にした-->
                      <pane v-if="true" min-size="20" size="40">
                        <ImageMetaViewer></ImageMetaViewer>
                      </pane>
                    </splitpanes>
                  </pane>
                </splitpanes>
              </pane>
              <pane
                v-if="areaVisibleStore.state.rightSideVisibilityState.showArea"
                size="20"
                min-size="14"
              >
                <RightSideArea></RightSideArea>
              </pane>
            </splitpanes>
          </pane>
        </splitpanes>
        <RightSideMenu></RightSideMenu>
      </div>
      <Footer></Footer>
    </va-inner-loading>
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
  overflow: hidden;

  .content-area {
    display: flex;
    margin-top: var.$header-height;
    .size-variable-area {
      height: calc(100vh - #{var.$header-height} - #{var.$footer-height});
      width: calc(
        100vw - #{var.$left-sidemenu-width} - #{var.$right-sidemenu-width}
      );
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
  min-width: 4px !important;
  min-height: 4px !important;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    height: 100%;
    min-width: 2px !important;
    min-height: 2px !important;
    background: var.$split-bar-color;
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

.inner-loading__overlay:after {
  background-color: #919192;
  opacity: 0.2 !important;
}
</style>
