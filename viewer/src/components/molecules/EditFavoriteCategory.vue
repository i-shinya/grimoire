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

// TODO childの追加

// TODO categoryの削除

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
        class="category-input"
        :value="updateCategory.label"
        @input="updateCategoryLabel"
        spellcheck="false"
      />
    </div>
    <template v-if="showChild">
      <template v-for="(child, index) in category.children" :key="child.id">
        <EditCategoryChild
          :child="child"
          @send-val="(v: CategoryChild) => updateChild(index, v)"
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
      padding-top: 6px;
      padding-bottom: 6px;
      white-space: nowrap;
      background-color: transparent;
      border: none;

      &:focus {
        background-color: rgb(76, 75, 75);
      }
    }
  }
}
</style>
