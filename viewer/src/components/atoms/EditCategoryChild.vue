<script setup lang="ts">
import { CategoryChild } from "../../core/type/favorite";
import { ref, watch } from "vue";

const props = defineProps<{
  child: CategoryChild;
}>();

const emits = defineEmits<{
  (e: "send-val", child: CategoryChild): void;
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

// TODO childの削除

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
        class="clickable child-input"
        :value="child.label"
        @input="updateLabel"
        spellcheck="false"
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

    .child-input {
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

  .child-value {
    color: white;
    width: 98%;
    max-width: 98%;
    border: 1px solid white;
    background-color: transparent;
    border-radius: 3px;
  }
}
</style>
