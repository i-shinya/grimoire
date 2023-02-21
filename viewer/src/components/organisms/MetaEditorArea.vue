<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from "vue";
import Property from "../atoms/Property.vue";
import { PropertyKey } from "../../store/key";
import { useToast } from "vuestic-ui";

const propertyStore = inject(PropertyKey);
if (!propertyStore) throw new Error("failed to inject store from PropertyKey");

const emphasisSymbols = ["{}", "()"] as const;
const restraintSymbols = ["[]"] as const;

const { init, close, closeAll } = useToast();
const copyToClipboard = (input: string, flyText: string) => {
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
  if (event.code === "KeyC" && event.ctrlKey && !event.shiftKey) {
    if (!propertyStore.displayPositive()) {
      return;
    }
    copyToClipboard(
      propertyStore.displayPositive(),
      `Copy "Positive Prompt" to Clipboard!!`
    );
  } else if (event.code === "KeyC" && event.ctrlKey && event.shiftKey) {
    if (!propertyStore.displayNegative()) {
      return;
    }
    copyToClipboard(
      propertyStore.displayNegative(),
      `Copy "Negative Prompt" to Clipboard!!`
    );
  }
};

const changeEmphasis = (value: "{}" | "()") => {
  propertyStore.updateEmphasisSymbol(value);
};
const changeRestraint = (value: "[]") => {
  propertyStore.updateRestraintSymbol(value);
};

const clearMeta = () => {
  propertyStore.clearProperty();
};

const emphasisSymbol = computed(() => propertyStore.state.emphasisSymbolType);
const restraintSymbol = computed(() => propertyStore.state.restraintSymbolType);

onMounted(() => {
  document.addEventListener("keydown", editorShortcutKey);
});
onBeforeUnmount(() => {
  document.removeEventListener("keydown", editorShortcutKey);
});
</script>

<template>
  <div id="meta-editor-area">
    <div class="editor-config-area">
      <div class="radio-area">
        <div class="radio-row mb-2">
          <p class="check-label ml-2 mr-4 pb-1">Emphasis</p>
          <va-radio
            color="#268AFF"
            v-for="(option, index) in emphasisSymbols"
            :key="index"
            v-model="emphasisSymbol"
            :option="option"
            @update:model-value="changeEmphasis"
          />
        </div>
        <div class="radio-row">
          <p class="check-label ml-2 mr-4 pb-1">Restraint</p>
          <va-radio
            color="#268AFF"
            v-for="(option, index) in restraintSymbols"
            :key="index"
            v-model="restraintSymbol"
            :option="option"
            @update:model-value="changeRestraint"
          />
        </div>
      </div>
      <div class="clear-icon">
        <font-awesome-icon
          class="clickable"
          icon="fa-solid fa-trash-can"
          @click="clearMeta()"
        />
      </div>
    </div>
    <div class="mt-4 mb-4">
      <va-divider />
    </div>

    <Property
      class="mb-4"
      label="Positive Prompt"
      shortcutText="press Ctrl + C"
      :value="propertyStore.displayPositive()"
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

  .editor-config-area {
    display: flex;
    justify-content: space-between;

    .radio-area {
      .radio-row {
        display: flex;
        align-items: flex-end;

        .check-label {
          width: 72px;
        }
      }
    }
    .clear-icon {
      padding-top: 8px;
      padding-right: 8px;
    }
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
