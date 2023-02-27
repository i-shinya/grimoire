<script setup lang="ts">
import { ref } from "vue";
import { PromptCategory } from "../../core/type/favorite";
import CategoryChild from "../atoms/CategoryChild.vue";

defineProps<{
  category: PromptCategory;
}>();

const showChild = ref<boolean>(false);
const switchChildVisible = () => {
  showChild.value = !showChild.value;
};
</script>

<template>
  <div class="favorite-category">
    <div class="category-label-row" @click="switchChildVisible()">
      <font-awesome-icon
        v-if="!showChild"
        class="arrow-icon"
        icon="fa-solid fa-angle-right"
      />
      <font-awesome-icon
        v-else
        class="arrow-icon"
        icon="fa-solid fa-angle-down"
      />
      <p class="category-label">{{ category.label }}</p>
    </div>
    <template v-if="showChild">
      <template v-for="child in category.children" :key="child.id">
        <CategoryChild :child="child"></CategoryChild>
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

    .category-label {
      cursor: pointer;
      flex-grow: 1;
      padding-top: 6px;
      padding-bottom: 6px;
      white-space: nowrap;
    }
  }
}
</style>
