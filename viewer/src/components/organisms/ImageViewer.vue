<script setup lang="ts">
import { computed, inject } from "vue";
import { AreaVisibilityKey, DirectoryKey, ImageKey } from "../../store/key";
import { ImageDetail, ImageIndex, ThumbnailSize } from "../../core/type/image";
import BreadCrumbs, { Bread } from "../molecules/BreadCrumbs.vue";
import { DirectoryAPI, DirectoryAPIKey } from "../../core/api/directory";
import { divideArray } from "../../core/array";
import { StoreAPIKey } from "../../core/api/store";

const directoryStore = inject(DirectoryKey);
if (!directoryStore)
  throw new Error("failed to inject store from DirectoryKey");
const imageStore = inject(ImageKey);
if (!imageStore) throw new Error("failed to inject store from ImageKey");
const areaVisibilityStore = inject(AreaVisibilityKey);
if (!areaVisibilityStore)
  throw new Error("failed to inject store from AreaVisibilityKey");
const directoryAPI = inject<DirectoryAPI>(DirectoryAPIKey);
if (!directoryAPI) {
  throw new Error("failed to inject api from directoryAPI");
}
const storeAPI = inject(StoreAPIKey);
if (!storeAPI) {
  throw new Error("failed to inject api from storeAPI");
}

const selectImage = (image: ImageDetail) => {
  imageStore.selectImage(selectPath.value, image);
  areaVisibilityStore.showImageMetaViewer();
};

// 画像一覧の更新
const reloadDirectoryTree = async () => {
  if (selectPath.value) {
    areaVisibilityStore.showLoading();
    directoryAPI
      .listImageIndex(selectPath.value)
      .then(async (imageIndex: ImageIndex[]) => {
        directoryStore.setImageDetails([]);
        // 配列を100件に分割して並列で取得する
        const indexes = divideArray(imageIndex, 100);
        await Promise.all(
          indexes.map(async (list) => {
            const images = await directoryAPI.getImages(selectPath.value, list);
            directoryStore.pushImageDetails(images);
          })
        );
      })
      .finally(() => {
        areaVisibilityStore.hiddenLoading();
      });
  }
};

const changeThumbnailSize = (size: ThumbnailSize) => {
  imageStore.setThumbnailSize(size);
  storeAPI.saveThumbnailSize(size);
};

const selectPath = computed(
  () => directoryStore.state.selectedDirectoryPath ?? ""
);
const images = computed(
  // TODO ここreadonlyでバグるかも
  () => directoryStore.state.imageDetails?.map((detail) => detail) ?? []
);
const breads = computed(() => {
  if (!selectPath.value) return [];
  return selectPath.value.split("/").map((val, index) => {
    return { id: index, text: val };
  });
});

const isSelected = computed(() => (image: ImageDetail): boolean => {
  return (
    image.id === imageStore.state.imageDetail?.id &&
    selectPath.value === imageStore.state.selectedImageBasePath
  );
});
</script>

<template>
  <div id="image-viewer">
    <div class="sticky-area pt-3 mb-4">
      <div class="bread-crumbs-area" v-if="breads.length !== 0">
        <BreadCrumbs :breads="breads"></BreadCrumbs>
        <div class="icon-area">
          <font-awesome-icon
            class="clickable mr-3 pt-1"
            icon="fa-solid fa-arrow-rotate-right"
            @click="reloadDirectoryTree"
          />

          <div class="thumbnail-size-icon">
            <font-awesome-icon
              class="small clickable mr-4"
              :class="imageStore.state.thumbnailSize === 'small' ? 'now' : ''"
              icon="fa-regular fa-image"
              @click="changeThumbnailSize('small')"
            />
            <font-awesome-icon
              class="default clickable mr-4"
              :class="imageStore.state.thumbnailSize === 'default' ? 'now' : ''"
              icon="fa-regular fa-image"
              @click="changeThumbnailSize('default')"
            />
            <font-awesome-icon
              class="big clickable"
              :class="imageStore.state.thumbnailSize === 'big' ? 'now' : ''"
              icon="fa-regular fa-image"
              @click="changeThumbnailSize('big')"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="image-viewer">
      <template v-for="item of images" :key="item.id">
        <div
          class="image-area"
          :class="imageStore.state.thumbnailSize"
          @click="selectImage(item)"
        >
          <img
            class="image"
            :class="[
              isSelected(item) ? 'is-selected-image' : '',
              imageStore.state.thumbnailSize,
            ]"
            :src="item.dataUrl"
            :draggable="true"
          />
          <div class="image-label">{{ item.label }}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../../variables.scss" as var;

#image-viewer {
  height: 100%;
  width: 100%;
  border-right: 1px black solid;
  background-color: rgb(34, 34, 34);
  overflow: auto;
  padding: 0 12px 12px 12px;
  position: relative;

  /* スクロール幅 */
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  /* スクロール背景 */
  &::-webkit-scrollbar-track {
    border-radius: 5px;
    background: rgba(110, 108, 108, 0.2);
  }
  /* ドラック部 */
  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: #c2c2c2;
  }

  .sticky-area {
    position: sticky;
    top: 0;
    background-color: rgb(34, 34, 34);

    .bread-crumbs-area {
      display: flex;
      flex-direction: column;

      .icon-area {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .thumbnail-size-icon {
          display: flex;
          align-items: center;
          color: #b9b9b9;

          .now {
            color: white;
          }

          .small {
            font-size: 14px;
          }
          .default {
            font-size: 16px;
          }
          .big {
            font-size: 18px;
          }
        }
      }
    }
  }

  .image-viewer {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-wrap: wrap;

    .image-area {
      color: white;
      max-height: 30%;
      padding: 8px;
      cursor: pointer;

      // サムネイルサイズ、storeに保存されている値
      &.small {
        max-width: 136px;
        min-width: 136px;
      }
      &.default {
        max-width: 256px;
        min-width: 256px;
      }
      &.big {
        max-width: 376px;
        min-width: 376px;
      }

      .image {
        height: auto;

        // サムネイルサイズ、storeに保存されている値
        &.small {
          max-width: 120px;
          min-width: 120px;
        }
        &.default {
          max-width: 240px;
          min-width: 240px;
        }
        &.big {
          max-width: 360px;
          min-width: 360px;
        }

        &.is-selected-image {
          border: 2px solid rgb(150, 161, 109);
        }
      }
      .image-label {
        padding-top: 4px;
        font-size: 16px;
        text-align: center;
      }
    }
  }
}
</style>
