<script setup lang="ts">
import { computed, inject, ref, watch } from "vue";
import { AreaVisibilityKey, DirectoryKey, ImageKey } from "../../store/key";
import {
  ImageDetail,
  ImageIndex,
  ImageLocation,
  ThumbnailSize,
} from "../../core/type/image";
import BreadCrumbs, { Bread } from "../molecules/BreadCrumbs.vue";
import { DirectoryAPI, DirectoryAPIKey } from "../../core/api/directory";
import { divideArray } from "../../core/array";
import { StoreAPIKey } from "../../core/api/store";
import Thumbnail from "../atoms/Thumbnail.vue";
import ImageModal from "../molecules/ImageModal.vue";
import { OrderType, Sort, SortType } from "../../core/type/listing";
import { useModal, useToast } from "vuestic-ui";

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
const checkedImages = ref<
  { id: number; isChecked: boolean; filename: string }[]
>([]);

const selectImage = (image: ImageDetail) => {
  imageStore.selectImage(selectPath.value, image);
  areaVisibilityStore.showImageMetaViewer();
};
const receiveDataUrl = (id: number, dataUrl: string) => {
  directoryStore.setImageDataUrl(id, dataUrl);
};
const receiveCheckedChange = (id: number, isChecked: boolean) => {
  // checkedImagesから一致するidを探してisCheckedを更新
  const index = checkedImages.value.findIndex((image) => image.id === id);
  if (index >= 0) {
    checkedImages.value[index].isChecked = isChecked;
  }
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
  ) {
    return null;
  }
  return (
    directoryStore.state.imageDetails.find(
      (image) => image.id === imageStore.state.imageDetail?.id
    ) ?? directoryStore.state.imageDetails[0]
  );
});

// ファイルコピー
const { confirm } = useModal(); // vuesticのモーダルを使用
const { init } = useToast();
const clickCopyFile = async () => {
  // チェックされている画像がないなら何もしない
  if (checkedImages.value.filter((image) => image.isChecked).length === 0) {
    return;
  }

  // 選択先のディレクトリを選択する
  const path: string = await directoryAPI.openDialog(areaVisibilityStore);
  if (!path) {
    return;
  }

  const targetImages: ImageLocation[] = checkedImages.value
    .filter((image) => image.isChecked)
    .map((image) => {
      return {
        id: image.id,
        basePath: selectPath.value,
        filename: image.filename,
      };
    });
  if (targetImages.length === 0) return;
  const res = await directoryAPI.copyImages(targetImages, path);
  if (res.isFailed) {
    return;
  }
  if (res.imageDetails.length === 0) {
    // 全てのチェックを外す
    checkedImages.value = checkedImages.value.map((image) => {
      return { ...image, isChecked: false };
    });
    init({
      closeable: false,
      color: "#FFFFFF",
      message: "All files have been successfully copied.",
      offsetX: 20,
      offsetY: 30,
      duration: 2000,
    });
    return;
  }

  // TODO 一旦雑にconfirmにしているけどそのうちちゃんとしたUIにする
  const ok = await confirm({
    title: "file already exist",
    message:
      "Some file have been successfully copied. But, Some file already exist. Overwrite?",
    okText: "OK",
    cancelText: "cancel",
  });
  // resに含まれる画像以外のチェックを外す。forceCopyでエラーが出た用にここで更新
  checkedImages.value = checkedImages.value.map((image) => {
    return {
      ...image,
      isChecked: !!res.imageDetails.find((v) => v.id === image.id),
    };
  });
  if (ok) {
    await directoryAPI.forceCopyImages(targetImages, path);
    // 全てのチェックを外す
    checkedImages.value = checkedImages.value.map((image) => {
      return { ...image, isChecked: false };
    });
    init({
      closeable: false,
      color: "#FFFFFF",
      message: "All files have been successfully copied.",
      offsetX: 20,
      offsetY: 30,
      duration: 2000,
    });
  } else {
    init({
      closeable: false,
      color: "#FFFFFF",
      message: "Some files have been successfully copied.",
      offsetX: 20,
      offsetY: 30,
      duration: 2000,
    });
  }
};

watch(
  () => directoryStore.state.sort,
  (state) => {
    sortType.value = state?.type ?? "label";
  },
  { immediate: true, deep: true }
);

watch(
  () => directoryStore.state.imageDetails,
  (state, before) => {
    if (!state) return;
    // stateとbeforeが一致していたら何もしない
    if (before && state.length === before.length) {
      let isSame = true;
      for (let i = 0; i < state.length; i++) {
        if (
          state[i].id !== before[i].id ||
          state[i].label !== before[i].label
        ) {
          isSame = false;
          break;
        }
      }
      if (isSame) return;
    }
    console.log("hogehoge");
    checkedImages.value = state.map((image) => {
      return { id: image.id, isChecked: false, filename: image.label };
    });
  },
  { immediate: true, deep: true }
);
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

          <div class="file-copy-button clickable" @click="clickCopyFile">
            <font-awesome-icon
              class="check-icon mr-2"
              icon="fa-regular fa-square-check"
            />
            <p>file copy</p>
          </div>

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
        v-for="item of directoryStore.getViewImageDetail()"
        :key="item.id"
      >
        <Thumbnail
          class="list-thumbnail"
          :class="imageStore.state.thumbnailSize"
          :image="item"
          :isSelect="isSelected(item)"
          :isChecked="checkedImages.find((v) => v.id === item.id)?.isChecked"
          :getImage="getImage"
          @sendClick="selectImage(item)"
          @sendDblclick="showModal = true"
          @sendDataUrl="(v: string) => receiveDataUrl(item.id, v)"
          @sendCheckedChange="(v: boolean) => receiveCheckedChange(item.id, v)"
        ></Thumbnail>
      </template>
    </div>
    <ImageModal
      v-if="showModal"
      :images="directoryStore.getViewImageDetail()"
      :show="showModal"
      :getImage="getImage"
      :defaultImage="getMainImageDetail"
      :checkedImages="checkedImages"
      @hideModal="showModal = false"
      @sendCheckedChange="(id:number, isChecked: boolean) => receiveCheckedChange(id, isChecked)"
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

        .file-copy-button {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px 12px;
          border: 1px solid rgb(255, 255, 255);
          color: rgb(255, 255, 255);
          background-color: rgba(1, 9, 47, 0.89);
          font-size: 16px;
          user-select: none;
          font-weight: bold;
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
