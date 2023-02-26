<script setup lang="ts">
import { inject, reactive, ref } from "vue";
import { AreaVisibilityKey } from "../../store/key";
import FavoriteCategory from "../molecules/FavoriteCategory.vue";
import { Favorite } from "../../core/type/favorite";
import EditFavoriteCategory from "../molecules/EditFavoriteCategory.vue";
import AddButton from "../atoms/AddButton.vue";

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

// カテゴリの追加
const addCategory = () => {
  console.log("hogeohge");
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
      <div class="edit-button-area mb-3 clickable" @click="save" v-else>
        <font-awesome-icon class="mr-2" icon="fa-solid fa-floppy-disk" />
        <div>Save Favorite</div>
      </div>
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
            @delete-category="deleteCategory(index)"
          ></EditFavoriteCategory>
        </template>
        <AddButton
          class="add-category-button mt-3"
          :showText="true"
          text="Add Category"
          @click="addCategory"
        ></AddButton>
        <div class="button-area mt-3">
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
  background-color: rgb(48, 48, 48);
  overflow-x: auto;
  overflow-y: auto;
  padding-top: 16px;
  padding-left: 8px;
  padding-right: 8px;
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
        padding: 1px;
        border-radius: 10px;
        color: #cacaca;
      }

      .save-button {
        display: flex;
        border: 1px solid white;
        flex-grow: 1;
        justify-content: center;
        padding: 1px;
        background-color: #24253c;
        border-radius: 10px;
      }
    }
  }
}
</style>
