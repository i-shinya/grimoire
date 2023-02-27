<script setup lang="ts">
import { inject, ref } from "vue";
import { AreaVisibilityKey, FavoritePromptKey } from "../../store/key";
import FavoriteCategory from "../molecules/FavoriteCategory.vue";
import { FavoritePrompt, PromptCategory } from "../../core/type/favorite";
import EditFavoriteCategory from "../molecules/EditFavoriteCategory.vue";
import AddButton from "../atoms/AddButton.vue";
import { StoreAPIKey } from "../../core/api/store";

const areaVisibilityStore = inject(AreaVisibilityKey);
if (!areaVisibilityStore) {
  throw new Error("failed to inject store from AreaVisibilityKey");
}
const favoritePromptStore = inject(FavoritePromptKey);
if (!favoritePromptStore) {
  throw new Error("failed to inject store from favoritePromptStore");
}
const storeAPI = inject(StoreAPIKey);
if (!storeAPI) {
  throw new Error("failed to inject storeAPI from StoreAPIKey");
}

const isEdit = ref(false);
const editingFavorite = ref<FavoritePrompt>({ categories: [] });

const doEdit = () => {
  // store.stateはreadonlyなのでコピー
  editingFavorite.value = {
    categories: favoritePromptStore.state.favorite.categories.map(
      (category) => {
        return {
          id: category.id,
          label: category.label,
          children: category.children.map((child) => {
            return {
              id: child.id,
              label: child.label,
              value: child.value,
            };
          }),
        };
      }
    ),
  };
  isEdit.value = true;
};

const updateCategory = (index: number, category: PromptCategory) => {
  editingFavorite.value.categories[index] = category;
};

const save = async () => {
  // configへの保存
  const copy = {
    categories: editingFavorite.value.categories.map((category) => {
      return {
        id: category.id,
        label: category.label,
        children: category.children.map((child) => {
          return {
            id: child.id,
            label: child.label,
            value: child.value,
          };
        }),
      };
    }),
  };
  await storeAPI.saveFavoritePrompt(copy);

  // storeへの保存
  favoritePromptStore.setFavoritePrompt(copy);
  isEdit.value = false;
};

const cancel = () => {
  editingFavorite.value = { categories: [] };
  isEdit.value = false;
};

// カテゴリの追加
const addCategory = () => {
  const nextId =
    editingFavorite.value!!.categories.length !== 0
      ? editingFavorite
          .value!!.categories.map((val) => val.id)
          .reduce((a, b) => Math.max(a, b)) + 1
      : 1;
  editingFavorite.value.categories.push({
    id: nextId,
    label: "",
    children: [],
  });
};

// カテゴリの削除
const deleteCategory = (index: number) => {
  editingFavorite.value.categories.splice(index, 1);
};
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
      <div class="edit-button-area mb-3 clickable" @click="save" v-else>
        <font-awesome-icon class="mr-2" icon="fa-solid fa-floppy-disk" />
        <div>Save Favorite</div>
      </div>
    </div>
    <div class="categories-area">
      <template v-if="!isEdit">
        <template
          v-for="category in favoritePromptStore.state.favorite.categories"
          :key="category.id"
        >
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
            @send-val="(v: PromptCategory) => updateCategory(index, v)"
            @delete-category="deleteCategory(index)"
          ></EditFavoriteCategory>
        </template>
        <AddButton
          class="add-category-button mt-3"
          :showText="true"
          text="Add Category"
          @click="addCategory"
        ></AddButton>
        <div class="button-area mt-4">
          <div class="cancel-button clickable mr-2" @click="cancel">cancel</div>
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
  width: 100%;
  background-color: #222222;
  overflow-x: auto;
  overflow-y: auto;
  padding-top: 16px;
  padding-left: 6px;
  padding-right: 6px;
  font-size: 15px;

  /* スクロール幅 */
  &::-webkit-scrollbar {
    width: 2px;
    height: 2px;
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
  &:hover {
    /* スクロール幅 */
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
  }

  .edit-button-area {
    display: flex;
    border: 1px solid rgb(255, 255, 255);
    padding: 4px;
    justify-content: center;
    user-select: none;
    background-color: #24253c;
  }

  .categories-area {
    .add-category-button {
      background-color: rgb(48, 48, 48);
    }

    .button-area {
      display: flex;
      justify-content: space-around;

      .cancel-button {
        border: 1px solid white;
        flex-grow: 1;
        text-align: center;
        justify-content: center;
        align-items: center;
        padding: 4px;
        border-radius: 10px;
        color: #cacaca;
      }

      .save-button {
        display: flex;
        border: 1px solid white;
        flex-grow: 1;
        justify-content: center;
        align-items: center;
        padding: 4px;
        background-color: #24253c;
        border-radius: 10px;
      }
    }
  }
}
</style>
