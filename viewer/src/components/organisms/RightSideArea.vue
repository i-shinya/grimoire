<script setup lang="ts">
import { inject, reactive } from "vue";
import { AreaVisibilityKey } from "../../store/key";
import FavoriteCategory from "../molecules/FavoriteCategory.vue";
import AddButton from "../atoms/AddButton.vue";

const areaVisibilityStore = inject(AreaVisibilityKey);
if (!areaVisibilityStore) {
  throw new Error("failed to inject store from AreaVisibilityKey");
}

const openEditModal = () => {};

const categories = reactive([
  {
    id: 1,
    label: "絵柄",
    children: [
      { id: 1, label: "アニメ調", value: "anime screen" },
      {
        id: 2,
        label: "いい感じの",
        value:
          "masterpiece, best quality, masterpiece, best quality, masterpiece, best quality",
      },
    ],
  },
  {
    id: 2,
    label: "背景",
    children: [
      { id: 1, label: "東京", value: "Tokyo, city" },
      { id: 2, label: "child2", value: "hogehoge2" },
    ],
  },
]);
</script>

<template>
  <div class="right-side-area">
    <div class="edit-button-area clickable mb-3" @click="openEditModal">
      <font-awesome-icon
        class="edit-icon mr-2"
        icon="fa-solid fa-pen-to-square"
      />
      <div>Edit Favorite</div>
    </div>
    <template v-for="category in categories" :key="category.id">
      <FavoriteCategory :category="category"></FavoriteCategory>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.right-side-area {
  height: 100%;
  width: 240px;
  background-color: rgb(48, 48, 48);
  overflow-x: auto;
  overflow-y: auto;
  padding-top: 16px;
  padding-left: 8px;
  padding-right: 8px;

  .edit-button-area {
    display: flex;
    border: 1px solid rgb(255, 255, 255);
    padding: 4px;
    cursor: pointer;
    justify-content: center;

    .edit-icon {
      font-size: 16px;
    }
  }
}
</style>
