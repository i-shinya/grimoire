<script setup lang="ts">
import { inject, reactive, ref } from "vue";
import { AreaVisibilityKey } from "../../store/key";
import FavoriteCategory from "../molecules/FavoriteCategory.vue";
import { Favorite } from "../../core/type/favorite";
import EditFavoriteCategory from "../molecules/EditFavoriteCategory.vue";

const areaVisibilityStore = inject(AreaVisibilityKey);
if (!areaVisibilityStore) {
  throw new Error("failed to inject store from AreaVisibilityKey");
}

const isEdit = ref(false);
const editingFavorite = ref<Favorite>({ categories: [] });

const doEdit = () => {
  editingFavorite.value = favorite.value;
  isEdit.value = true;
};

const updateCategory = (index: number, category: FavoriteCategory) => {
  editingFavorite.value.categories[index] = category;
};

const save = () => {
  // TODO ストアに保存
  favorite.value = editingFavorite.value;
  isEdit.value = false;
};

const cancel = () => {
  editingFavorite.value = { categories: [] };
  isEdit.value = false;
};

// TODO カテゴリの追加

const favorite = ref<Favorite>({
  categories: [
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
  ],
});
</script>

<template>
  <div class="right-side-area">
    <div>
      <div
        class="edit-button-area mb-3 clickable"
        @click="doEdit"
        v-if="!isEdit"
      >
        <font-awesome-icon
          class="edit-icon mr-2"
          icon="fa-solid fa-pen-to-square"
        />
        <div>Edit Favorite</div>
      </div>
      <div class="edit-button-area mb-3" v-else>Editing Favorite</div>
    </div>
    <div class="categories-area">
      <template v-if="!isEdit">
        <template v-for="category in favorite.categories" :key="category.id">
          <FavoriteCategory :category="category"></FavoriteCategory>
        </template>
      </template>
      <template v-else>
        <template
          v-for="(category, index) in editingFavorite.categories"
          :key="category.id"
        >
          <EditFavoriteCategory
            :category="category"
            @send-val="(v: FavoriteCategory) => updateCategory(index, v)"
          ></EditFavoriteCategory>
        </template>
        <div class="button-area mt-3">
          <div class="cancel-button clickable mr-4" @click="cancel">cancel</div>
          <div class="save-button clickable" @click="save">
            <font-awesome-icon class="mr-2" icon="fa-solid fa-floppy-disk" />
            <p class="save-button-text">save</p>
          </div>
        </div>
      </template>
    </div>
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
    justify-content: center;
    user-select: none;

    .edit-icon {
      font-size: 16px;
    }
  }

  .categories-area {
    .button-area {
      display: flex;
      justify-content: space-around;

      .cancel-button {
        border: 1px solid white;
        flex-grow: 1;
        text-align: center;
      }

      .save-button {
        display: flex;
        border: 1px solid white;
        flex-grow: 1;
        justify-content: center;
      }
    }
  }
}
</style>
