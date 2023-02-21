<script setup lang="ts">
import { inject, computed } from "vue";
import { PropertyKey } from "../../store/key";
import { Prompt } from "../../store/property";
import PromptEditor from "../molecules/PromptEditor.vue";

const propertyStore = inject(PropertyKey);
if (!propertyStore) throw new Error("failed to inject store from PropertyKey");

const receivePositive = (prompt: Prompt[]) => {
  propertyStore.updatePositive(prompt);
};
const receiveNegative = (prompt: Prompt[]) => {
  propertyStore.updateNegative(prompt);
};

// stateがreadonlyのためコピー
const copyPrompt = (prompts: any) =>
  prompts.map((val: any) => {
    return {
      id: val.id,
      spell: val.spell,
      emphasis: val.emphasis,
    };
  }) ?? [];

const positive = computed(() => copyPrompt(propertyStore.state.positive));
const negative = computed(() => copyPrompt(propertyStore.state.negative));
</script>

<template>
  <div id="prompt-editor-area">
    <splitpanes>
      <pane>
        <PromptEditor
          class="mb-4"
          label="Positive Prompt"
          :prompt="positive"
          :emphasisSymbolType="propertyStore.state.emphasisSymbolType"
          :restraintSymbolType="propertyStore.state.restraintSymbolType"
          @send-val="receivePositive"
        ></PromptEditor>
      </pane>
      <pane>
        <PromptEditor
          class="mb-4"
          label="Negative Prompt"
          :prompt="negative"
          :emphasisSymbolType="propertyStore.state.emphasisSymbolType"
          :restraintSymbolType="propertyStore.state.restraintSymbolType"
          @send-val="receiveNegative"
        ></PromptEditor>
      </pane>
    </splitpanes>
  </div>
</template>

<style lang="scss" scoped>
@use "../../variables.scss" as var;

#prompt-editor-area {
  height: 100%;
  width: 100%;
  background-color: rgb(37, 18, 18);
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
