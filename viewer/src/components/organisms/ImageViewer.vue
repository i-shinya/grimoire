<script setup lang="ts">
import { computed, inject, onMounted, ref } from "vue";
import { AreaVisibilityKey, DirectoryKey, ImageKey } from "../../store/key";
import { ImageDetail, ImageIndex, ThumbnailSize } from "../../core/type/image";
import BreadCrumbs, { Bread } from "../molecules/BreadCrumbs.vue";
import { DirectoryAPI, DirectoryAPIKey } from "../../core/api/directory";
import { divideArray } from "../../core/array";
import { StoreAPIKey } from "../../core/api/store";
import Thumbnail from "../atoms/Thumbnail.vue";
import ImageModal from "../molecules/ImageModal.vue";
import { OrderType, Sort, SortType } from "../../core/type/listing";

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

const showModal = ref(false);
const sortType = ref<SortType>("label");

const selectImage = (image: ImageDetail) => {
  imageStore.selectImage(selectPath.value, image);
  areaVisibilityStore.showImageMetaViewer();
};
const receiveDataUrl = (id: number, dataUrl: string) => {
  directoryStore.setImageDataUrl(id, dataUrl);
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

const changeSortOrder = (order: OrderType) => {
  const sort: Sort = {
    type: directoryStore.state.sort?.type ?? "label",
    order: order,
  };
  directoryStore.setSortSettings(sort);
  storeAPI.saveSortSettings(sort);
};

const changeSortType = () => {
  const sort: Sort = {
    type: sortType.value,
    order: directoryStore.state.sort?.order ?? "ASC",
  };
  directoryStore.setSortSettings(sort);
  storeAPI.saveSortSettings(sort);
};

const getImage = (filename: string) =>
  directoryAPI.getImageDataUrl(selectPath.value, filename).then((res) => res);

const selectPath = computed(
  () => directoryStore.state.selectedDirectoryPath ?? ""
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

const getMainImageDetail = computed(() => {
  if (
    !directoryStore.state.imageDetails ||
    directoryStore.state.imageDetails.length === 0
  )
    return null;
  return (
    directoryStore.state.imageDetails.find(
      (image) => image.id === imageStore.state.imageDetail?.id
    ) ?? directoryStore.state.imageDetails[0]
  );
});

onMounted(() => {
  sortType.value = directoryStore.state.sort?.type ?? "label";
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

          <font-awesome-icon
            class="show-modal-icon clickable"
            icon="fa-solid fa-images"
            @click="showModal = true"
          />

          <div class="sort-area">
            <div class="select-area">
              <font-awesome-icon class="mr-2 pa-0" icon="fa-solid fa-sort" />
              <select
                class="clickable"
                v-model="sortType"
                @change="changeSortType"
              >
                <option value="label">filename</option>
                <option value="createTime">create time</option>
              </select>
            </div>

            <template v-if="directoryStore.state.sort?.order === 'ASC'">
              <font-awesome-icon
                class="clickable"
                icon="fa-solid fa-arrow-up"
                @click="changeSortOrder('DESC')"
              />
            </template>
            <template v-else>
              <font-awesome-icon
                class="clickable"
                icon="fa-solid fa-arrow-down"
                @click="changeSortOrder('ASC')"
              />
            </template>
          </div>

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
              class="large clickable mr-4"
              :class="imageStore.state.thumbnailSize === 'large' ? 'now' : ''"
              icon="fa-regular fa-image"
              @click="changeThumbnailSize('large')"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="image-viewer">
      <template
        v-for="item of directoryStore.getViewImageDetail() ?? []"
        :key="item.id"
      >
        <Thumbnail
          class="list-thumbnail"
          :class="imageStore.state.thumbnailSize"
          :image="item"
          :isSelect="isSelected(item)"
          :getImage="getImage"
          @click="selectImage(item)"
          @dblclick="showModal = true"
          @sendDataUrl="(v: string) => receiveDataUrl(item.id, v)"
        ></Thumbnail>
      </template>
    </div>
    <ImageModal
      v-if="showModal"
      :images="directoryStore.getViewImageDetail() ?? []"
      :show="showModal"
      :getImage="getImage"
      :defaultImage="getMainImageDetail"
      @hideModal="showModal = false"
    ></ImageModal>
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

        .show-modal-icon {
          font-size: 20px;
        }

        .sort-area {
          display: flex;
          align-items: center;
          justify-content: space-between;
          //border: 1px solid #b9b9b9;
          background-color: #333333;

          .select-area {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 2px 4px;
            background-color: inherit;

            select {
              text-align: center;
              appearance: none;
              width: 100%;
              border-radius: 2px;
              background-color: inherit;
              border: none;
              color: white;
              font-size: 16px;
              user-select: none;
              font-weight: bold;
            }
          }
        }

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
          .large {
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

    .list-thumbnail {
      // サムネイルサイズ、storeに保存されている値
      &.small {
        max-width: 136px;
        width: 136px;
        min-width: 136px;
      }
      &.default {
        max-width: 256px;
        width: 256px;
        min-width: 256px;
      }
      &.large {
        max-width: 376px;
        width: 376px;
        min-width: 376px;
      }
    }
  }
}
</style>
