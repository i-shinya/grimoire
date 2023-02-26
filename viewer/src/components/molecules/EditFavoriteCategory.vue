<script setup lang="ts">
import { ref, watch } from "vue";
import { CategoryChild, FavoriteCategory } from "../../core/type/favorite";
import EditCategoryChild from "../atoms/EditCategoryChild.vue";

const props = defineProps<{
  category: FavoriteCategory;
}>();

const updateCategory = ref<FavoriteCategory>();

const emits = defineEmits<{
  (e: "send-val", category: FavoriteCategory): void;
  (e: "delete-category"): void;
}>();

const showChild = ref<boolean>(false);
const switchChildVisible = () => {
  showChild.value = !showChild.value;
};

const updateCategoryLabel = (e: Event) => {
  const target = e.target as HTMLInputElement;
  updateCategory.value!!.label = target.value;
  emits("send-val", updateCategory.value!!);
};

const updateChild = (index: number, value: CategoryChild) => {
  updateCategory.value!!.children[index] = value;
  emits("send-val", updateCategory.value!!);
};

// childの追加
const addChild = () => {
  const nextId =
    updateCategory.value!!.children.length !== 0
      ? updateCategory
          .value!!.children.map((val) => val.id)
          .reduce((a, b) => Math.max(a, b)) + 1
      : 1;
  updateCategory.value!!.children.push({ id: nextId, label: "", value: "" });
  emits("send-val", updateCategory.value!!);
  showChild.value = true;
};

// categoryの削除
const deleteCategory = () => {
  emits("delete-category");
};

const deleteChild = (index: number) => {
  updateCategory.value!!.children.splice(index, 1);
  emits("send-val", updateCategory.value!!);
};

watch(
  () => props.category,
  (state) => {
    updateCategory.value = state;
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <div class="favorite-category">
    <div class="category-label-row">
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
      <input
        class="category-input mr-2"
        :value="updateCategory.label"
        @input="updateCategoryLabel"
        spellcheck="false"
      />
      <font-awesome-icon
        class="clickable plus-icon mr-2"
        icon="fa-solid fa-plus"
        @click="addChild"
      />
      <font-awesome-icon
        class="clickable"
        icon="fa-solid fa-trash-can"
        @click="deleteCategory"
      />
    </div>
    <template v-if="showChild">
      <template v-for="(child, index) in category.children" :key="child.id">
        <EditCategoryChild
          :child="child"
          @send-val="(v: CategoryChild) => updateChild(index, v)"
          @delete-child="deleteChild(index)"
        ></EditCategoryChild>
      </template>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.favorite-category {
  overflow-x: auto;
  overflow-y: auto;
  padding: 2px;

  .category-label-row {
    display: flex;
    align-items: center;
    user-select: none;
    flex-grow: 1;

    .arrow-icon {
      cursor: pointer;
      flex-grow: 0;
      padding-right: 8px;
    }

    .category-input {
      width: 100%;
      color: white;
      cursor: pointer;
      flex-grow: 1;
      padding: 4px 4px;
      white-space: nowrap;
      background-color: #515050;
      border: none;

      &:focus {
        background-color: rgb(76, 75, 75);
      }
    }
  }
}
</style>
