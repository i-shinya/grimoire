<!-- このUIのみ他UIから参照・他UIを参照しています。
再帰コンポーネント実現のためこのようにしています。 -->
<script setup lang="ts">
import { computed, inject, ref } from "vue";
import { DirectoryKey, ImageKey, AreaVisibilityKey } from "../../../store/key";
import { DirectoryNode } from "../../../core/type/directory";
import { isImageExtension } from "../../../core/image";
import DirectoryTrees from "./DirectoryTrees.vue";
import { DirectoryAPI, DirectoryAPIKey } from "../../../core/api/directory";

// NOTE: 基本atomicとmoleculesからstoreは操作しないが、ツリーは階層が深いためこちらのみ許容する
const directoryStore = inject(DirectoryKey);
if (!directoryStore) {
  throw new Error("failed to inject store from DirectoryKey");
}
const imageStore = inject(ImageKey);
if (!imageStore) {
  throw new Error("failed to inject store from ImageKey");
}
const areaVisibilityStore = inject(AreaVisibilityKey);
if (!areaVisibilityStore) {
  throw new Error("failed to inject store from AreaVisibilityKey");
}
const directoryAPI = inject<DirectoryAPI>(DirectoryAPIKey);
if (!directoryAPI) {
  throw new Error("failed to inject api from directoryAPI");
}

defineProps<{
  node: DirectoryNode;
}>();

const showChild = ref<Boolean>(false);

const switchChildVisible = () => {
  showChild.value = !showChild.value;
};

// store経由でイベントを発火する
const selectDirectory = async (node: DirectoryNode) => {
  // TODO バッチ取得に変える
  await directoryAPI
    .getImages(`${node.basePath}/${node.label}`)
    .then((res) => directoryStore.setImageDetails(res));
  directoryStore.selectDirectory(`${node.basePath}/${node.label}`);
  areaVisibilityStore.showImageAres();
};

const selectImage = async (node: DirectoryNode) => {
  await directoryAPI.getImages(node.basePath).then((res) => {
    directoryStore.setImageDetails(res);
    directoryStore.selectDirectory(node.basePath);

    // 選択画像を抽出してストアに格納
    const imageDetails = res.filter((detail) => detail.label === node.label);
    if (!imageDetails || imageDetails.length === 0) {
      return;
    }
    areaVisibilityStore.showImageAres();
    areaVisibilityStore.showImageMetaViewer();
    imageStore.selectImage(node.basePath, imageDetails[0]);
  });
};

// ディレクトリor画像ファイルであることを確認
const isDirectoryOrImageFile = computed(() => (node: DirectoryNode) => {
  return node.isDirectory || isImageExtension(node.label);
});

const isSelected = computed(() => (node: DirectoryNode) => {
  return (
    `${node.basePath}/${node.label}` ===
    directoryStore.state.selectedDirectoryPath
  );
});
</script>

<template>
  <div class="directory-tree">
    <template
      v-if="node.children && node.children.length > 0 && node.isDirectory"
    >
      <!-- childrenが存在する場合はアローを表示 -->
      <div class="filename-area">
        <div class="filename-row">
          <font-awesome-icon
            v-if="!showChild"
            class="arrow-icon"
            icon="fa-solid fa-angle-right"
            @click="switchChildVisible()"
          />
          <font-awesome-icon
            v-else
            class="arrow-icon"
            icon="fa-solid fa-angle-down"
            @click="switchChildVisible()"
          />
          <font-awesome-icon class="file-type-icon" icon="fa-solid fa-folder" />
          <div
            class="filename"
            :class="isSelected(node) ? 'is-selected' : ''"
            @click="selectDirectory(node)"
          >
            <div>{{ node.label }}</div>
          </div>
        </div>
      </div>
      <template v-if="showChild">
        <div class="child-area">
          <!-- 同じ幅インデントするために不可視の矢印を追加 -->
          <font-awesome-icon
            class="hidden-arrow-icon"
            icon="fa-solid fa-angle-right"
          />
          <DirectoryTrees :nodes="node.children"></DirectoryTrees>
        </div>
      </template>
    </template>
    <!-- childrenが存在しない場合はそのまま表示 -->
    <template v-else>
      <!-- ディレクトリ or 画像ファイル以外は表示しない -->
      <template v-if="isDirectoryOrImageFile(node)">
        <div class="filename-area">
          <div class="filename-row">
            <font-awesome-icon
              v-if="node.isDirectory"
              class="file-type-icon"
              icon="fa-solid fa-folder"
            />
            <font-awesome-icon
              v-else
              class="file-type-icon"
              icon="fa-regular fa-image"
            />
            <div
              class="filename"
              :class="isSelected(node) ? 'is-selected' : ''"
              @click="selectImage(node)"
            >
              {{ node.label }}
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.directory-tree {
  font-size: 14px;
  .filename-area {
    display: flex;

    .filename-row {
      display: flex;
      align-items: center;
      user-select: none;
      flex-grow: 1;

      .arrow-icon {
        cursor: pointer;
        flex-grow: 0;
        padding-right: 8px;
      }

      .file-type-icon {
        font-size: 12px;
        flex-grow: 0;
        padding-right: 8px;
      }

      .filename {
        cursor: pointer;
        flex-grow: 1;
        padding-top: 6px;
        padding-bottom: 6px;
        white-space: nowrap;

        &.is-selected {
          color: #d1ca9a;
          font-weight: bold;
        }
      }
    }
  }

  .child-area {
    display: flex;
    .hidden-arrow-icon {
      padding-right: 8px;
      visibility: hidden;
    }
  }
}
</style>
