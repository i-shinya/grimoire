<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  value: string;
}>();

const val = ref<string>("");

const emits = defineEmits<{
  (e: "send-val", text: string): void;
  (e: "key-down", event: KeyboardEvent): void;
}>();

const pressKey = (event: KeyboardEvent) => {
  emits("key-down", event);
};

const changeValue = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emits("send-val", target.value);
};

watch(
  () => props.value,
  (state, _) => {
    val.value = state ?? "";
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <div class="input-area">
    <input
      class="input"
      type="text"
      :value="value"
      @input="changeValue"
      @keydown="pressKey"
      spellcheck="false"
    />
  </div>
</template>

<style lang="scss" scoped>
.input-area {
  font-size: 16px;
  color: rgb(240, 240, 240);

  .label-area {
    display: flex;
    .label {
      padding-left: 4px;
      cursor: pointer;
    }
    .clipboard-icon {
      cursor: pointer;
    }
  }

  .input {
    width: 100%;
    color: rgb(240, 240, 240);
    background-color: transparent;
    padding: 0;
    line-height: 26px;
    border-style: none;
  }
}
</style>
