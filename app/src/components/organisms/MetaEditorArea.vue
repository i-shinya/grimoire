<script setup lang="ts">
import { inject } from "vue";
import Property from "../atoms/Property.vue";
import { PropertyKey } from "../../store/key";

const propertyStore = inject(PropertyKey);
if (!propertyStore) throw new Error("failed to inejct store from PropertyKey");
</script>

<template>
  <div id="meta-editor-area">
    <Property
      class="mb-4"
      label="Positive Prompt"
      :value="propertyStore.displayPostive()"
    ></Property>
    <Property
      class="mb-4"
      label="Negative Prompt"
      :value="propertyStore.displayNegative()"
    ></Property>
  </div>
</template>

<style lang="scss" scoped>
@use "../../variables.scss" as var;

#meta-editor-area {
  height: 100%;
  width: 100%;
  background-color: rgb(37, 18, 18);
  padding: 12px;
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
