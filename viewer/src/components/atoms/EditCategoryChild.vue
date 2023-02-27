<script setup lang="ts">
import { CategoryChild } from "../../core/type/favorite";
import { ref, watch } from "vue";

const props = defineProps<{
  child: CategoryChild;
}>();

const emits = defineEmits<{
  (e: "send-val", child: CategoryChild): void;
  (e: "delete-child"): void;
}>();

const updateChild = ref<CategoryChild>();

const updateLabel = (e: Event) => {
  const target = e.target as HTMLInputElement;
  updateChild.value!!.label = target.value;
  emits("send-val", updateChild.value!!);
};

const updateValue = (e: Event) => {
  const target = e.target as HTMLInputElement;
  updateChild.value!!.value = target.value;
  emits("send-val", updateChild.value!!);
};

const deleteChild = () => {
  emits("delete-child");
};

watch(
  () => props.child,
  (state) => {
    updateChild.value = state;
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <div class="child-area mb-2">
    <div class="child-label-row mb-2">
      <input
        class="clickable child-input mr-2"
        :value="child.label"
        @input="updateLabel"
        spellcheck="false"
      />
      <font-awesome-icon
        class="clickable"
        icon="fa-solid fa-trash-can"
        @click="deleteChild"
      />
    </div>
    <textarea
      rows="4"
      class="child-value"
      :value="child.value"
      @input="updateValue"
      spellcheck="false"
    />
  </div>
</template>

<style lang="scss" scoped>
.child-area {
  font-size: 15px;
  padding: 2px;

  .child-label-row {
    display: flex;
    align-items: center;

    .child-input {
      width: 100%;
      color: white;
      cursor: pointer;
      flex-grow: 1;
      padding-top: 4px;
      padding-bottom: 4px;
      padding-left: 2px;
      white-space: nowrap;
      background-color: transparent;
      border: 1px solid rgb(129, 129, 129);

      &:focus {
        background-color: rgb(76, 75, 75);
      }
    }
  }

  .child-value {
    color: white;
    width: 98%;
    max-width: 98%;
    border: 1px solid rgb(129, 129, 129);
    background-color: transparent;
    resize: vertical;
    padding: 4px 2px;

    &:focus {
      background-color: rgb(76, 75, 75);
    }
  }
}
</style>
