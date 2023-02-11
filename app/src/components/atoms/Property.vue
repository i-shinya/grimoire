<script setup lang="ts">
import { useToast } from "vuestic-ui";

const props = defineProps<{
  label: string;
  shortcutText: string | null;
  value: number | string | undefined;
}>();

const { init, close, closeAll } = useToast();

const copyClipBoard = () => {
  const text = props.value?.toString() ?? "";
  navigator.clipboard.writeText(text).then(
    () => {
      /* clipboard successfully set */
      init({
        closeable: false,
        color: "#FFFFFF",
        message: `Copy "${props.label}" to Clipboard!!`,
        offsetX: 20,
        offsetY: 30,
        duration: 1000,
      });
    },
    () => {
      /* clipboard write failed */
    }
  );
};
</script>

<template>
  <div class="property">
    <div class="label-area">
      <div class="label mb-2 mr-3" @click="copyClipBoard">{{ label }}</div>
      <font-awesome-icon
        class="clipboard-icon mr-3"
        icon="fa-regular fa-copy"
        @click="copyClipBoard"
      />
      <div class="shortcut-text">{{ shortcutText }}</div>
    </div>
    <div class="value">{{ value }}</div>
  </div>
</template>

<style lang="scss" scoped>
.property {
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

  .value {
    background-color: rgb(54, 54, 54);
    padding: 6px;
    line-height: 26px;
    min-height: 26px;
  }

  .shortcut-text {
    color: rgb(182, 182, 182);
    font-size: 13px;
  }
}
</style>
