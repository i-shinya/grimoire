<script setup lang="ts">
import { useToast } from "vuestic-ui";

const props = defineProps<{
  label: string;
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
        message: `Copy ${props.label} to Clipboard !!`,
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
  <div class="property mb-4">
    <div class="label-area">
      <div class="label mb-2 mr-2" @click="copyClipBoard">{{ label }}</div>
      <font-awesome-icon
        class="clipboard-icon"
        icon="fa-regular fa-copy"
        @click="copyClipBoard"
      />
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
  }
}
</style>
