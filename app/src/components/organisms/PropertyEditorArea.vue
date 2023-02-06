<script setup lang="ts">
import { inject } from "vue";
import Input from "../atoms/Input.vue";
import Textarea from "../atoms/Textarea.vue";
import { PropertyKey } from "../../store/key";

const propertyStore = inject(PropertyKey);

const receiveVal = (val: { label: string; value: string }) => {
  propertyStore?.setValue(val);
};
</script>

<template>
  <div id="property-editor-area">
    <Textarea
      label="Positive Prompt"
      :value="propertyStore?.state.meta.positive ?? ''"
      @send-val="receiveVal"
    ></Textarea>
    <Textarea
      label="Negative Prompt"
      :value="propertyStore?.state.meta.negative ?? ''"
      @send-val="receiveVal"
    ></Textarea>
    <div class="property-row">
      <Input
        class="property-input"
        label="Steps"
        :value="propertyStore?.state.meta.steps ?? ''"
        @send-val="receiveVal"
      ></Input>
      <Input
        class="property-input"
        label="Scale"
        :value="propertyStore?.state.meta.scale ?? ''"
        @send-val="receiveVal"
      ></Input>
      <Input
        class="property-input"
        label="Seed"
        :value="propertyStore?.state.meta.seed ?? ''"
        @send-val="receiveVal"
      ></Input>
      <Input
        class="property-input"
        label="Sampler"
        :value="propertyStore?.state.meta.sampler ?? ''"
        @send-val="receiveVal"
      ></Input>
      <Input
        class="property-input"
        label="Strength"
        :value="propertyStore?.state.meta.strength ?? ''"
        @send-val="receiveVal"
      ></Input>
      <Input
        class="property-input"
        label="Noise"
        :value="propertyStore?.state.meta.noise ?? ''"
        @send-val="receiveVal"
      ></Input>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../../variables.scss" as var;

#property-editor-area {
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

  .property-row {
    display: flex;
    flex-wrap: wrap;

    .property-input {
      margin-right: 12px;
    }
  }
}
</style>
