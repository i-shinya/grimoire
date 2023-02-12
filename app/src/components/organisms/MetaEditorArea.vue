<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted } from "vue";
import Property from "../atoms/Property.vue";
import { PropertyKey } from "../../store/key";
import { useToast } from "vuestic-ui";

const propertyStore = inject(PropertyKey);
if (!propertyStore) throw new Error("failed to inject store from PropertyKey");

const { init, close, closeAll } = useToast();
const copyToClipbord = (input: string, flyText: string) => {
  navigator.clipboard.writeText(input).then(
    () => {
      /* clipboard successfully set */
      init({
        closeable: false,
        color: "#FFFFFF",
        message: flyText,
        offsetX: 20,
        offsetY: 30,
        duration: 2000,
      });
    },
    () => {
      /* clipboard write failed */
    }
  );
};

const editorShortcutKey = (event: KeyboardEvent) => {
  if (
    event.code === "KeyC" &&
    event.ctrlKey === true &&
    event.shiftKey == false
  ) {
    if (!propertyStore.displayPostive()) {
      return;
    }
    copyToClipbord(
      propertyStore.displayPostive(),
      `Copy "Positive Prompt" to Clipboard!!`
    );
  } else if (
    event.code === "KeyC" &&
    event.ctrlKey === true &&
    event.shiftKey == true
  ) {
    if (!propertyStore.displayNegative()) {
      return;
    }
    copyToClipbord(
      propertyStore.displayNegative(),
      `Copy "Negative Prompt" to Clipboard!!`
    );
  }
};

onMounted(() => {
  document.addEventListener("keydown", editorShortcutKey);
});
onBeforeUnmount(() => {
  document.removeEventListener("keydown", editorShortcutKey);
});
</script>

<template>
  <div id="meta-editor-area">
    <Property
      class="mb-4"
      label="Positive Prompt"
      shortcutText="press Ctrl + C"
      :value="propertyStore.displayPostive()"
    ></Property>
    <Property
      class="mb-4"
      shortcutText="press Ctrl + Shift+ C"
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
