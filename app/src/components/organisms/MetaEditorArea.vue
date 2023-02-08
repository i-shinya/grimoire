<script setup lang="ts">
import { inject } from "vue";
import Property from "../atoms/Property.vue";
import { PropertyKey } from "../../store/key";

const propertyStore = inject(PropertyKey);
</script>

<template>
  <div id="meta-editor-area">
    <Property
      class="mb-4"
      label="Positive Prompt"
      :value="propertyStore?.displayPostive()"
    ></Property>
    <Property
      class="mb-4"
      label="Negative Prompt"
      :value="propertyStore?.displayNegative()"
    ></Property>
    <!-- とりあえずはプロンプト以外はいらないかも -->
    <!-- <div class="meta-row">
      <Input
        class="meta-input mb-4"
        label="Steps"
        :value="propertyStore?.state.meta.steps ?? ''"
        @send-val="receiveVal"
      ></Input>
      <Input
        class="meta-input mb-4"
        label="Scale"
        :value="propertyStore?.state.meta.scale ?? ''"
        @send-val="receiveVal"
      ></Input>
      <Input
        class="meta-input mb-4"
        label="Seed"
        :value="propertyStore?.state.meta.seed ?? ''"
        @send-val="receiveVal"
      ></Input>
      <Input
        class="meta-input mb-4"
        label="Sampler"
        :value="propertyStore?.state.meta.sampler ?? ''"
        @send-val="receiveVal"
      ></Input>
      <Input
        class="meta-input mb-4"
        label="Strength"
        :value="propertyStore?.state.meta.strength ?? ''"
        @send-val="receiveVal"
      ></Input>
      <Input
        class="meta-input mb-4"
        label="Noise"
        :value="propertyStore?.state.meta.noise ?? ''"
        @send-val="receiveVal"
      ></Input>
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
@use "../../variables.scss" as var;

#meta-editor-area {
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

  .meta-row {
    display: flex;
    flex-wrap: wrap;

    .meta-input {
      margin-right: 12px;
    }
  }
}
</style>
