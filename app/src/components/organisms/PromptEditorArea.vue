<script setup lang="ts">
import { inject, ref, readonly, toRef, toRefs, onMounted, watch } from "vue";
import { PropertyKey } from "../../store/key";
import { Prompt } from "../../store/property";
import PromptEditor from "../molecules/PromptEditor.vue";

const propertyStore = inject(PropertyKey);
if (!propertyStore) {
  throw new Error("failed to inejct store from PropertyKey");
}

const postiive = ref<Prompt[]>([]);

const receivePositive = (prompt: Prompt[]) => {
  propertyStore.updatePositive(prompt);
};

onMounted(() => {
  postiive.value =
    propertyStore.state.postitive.map((val) => {
      return {
        id: val.id,
        spell: val.spell,
        emphasis: val.emphasis,
      };
    }) ?? []; // stateがreadonlyのためコピー
});
</script>

<template>
  <div id="prompt-editor-area">
    <PromptEditor
      label="Positive Prompt"
      :prompt="postiive"
      @send-val="receivePositive"
    ></PromptEditor>
  </div>
</template>

<style lang="scss" scoped>
@use "../../variables.scss" as var;

#prompt-editor-area {
  height: 100%;
  width: 100%;
  background-color: rgb(37, 18, 18);
  padding: 16px;
  overflow: auto;

  /* スクロール幅 */
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  /* スクロール背景 */
  &::-webkit-scrollbar-track {
    border-radius: 5px;
    background: rgba(110, 108, 108, 0.2);
  }
  /* ドラック部 */
  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: #acb2c7;
  }
}
</style>
