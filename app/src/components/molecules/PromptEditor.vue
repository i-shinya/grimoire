<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { Prompt } from "../../store/property";
import Input from "../atoms/Input.vue";

const props = defineProps<{
  label: string;
  prompt: Prompt[];
}>();

const emits = defineEmits<{
  (e: "send-val", prompt: Prompt[]): void;
}>();

const prompts = ref<Prompt[]>([]);

const receiveVal = (val: { id: number; label: string; value: string }) => {
  const res = prompts.value.map((prop: Prompt) => {
    if (prop.id === val.id) {
      prop.spell = val.value;
    }
    return prop;
  });
  emits("send-val", res);
};

onMounted(() => {
  prompts.value = props.prompt ?? "";
});
watch(
  () => props.prompt,
  (state, prevState) => {
    prompts.value = state;
  }
);
</script>

<template>
  <div class="prompt-editor">
    <div class="label-area">
      <div class="label mb-2 mr-2">{{ label }}</div>
    </div>
    <div class="editor-area">
      <template v-for="item of prompts" key="id">
        <div class="mb-1">
          <Input
            class="prompt-input"
            :id="item.id"
            :label="null"
            :value="item.spell"
            @send-val="receiveVal"
          ></Input>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../../variables.scss" as var;

.prompt-editor {
  width: 100%;
  background-color: rgb(37, 18, 18);
  padding: 16px;

  .label-area {
    display: flex;
    .label {
      padding-left: 4px;
      cursor: pointer;
    }
  }
}
</style>
