<script setup lang="ts">
// 使用しなくなったのでそのうち消すかも
import { ref, onMounted, watch } from "vue";
import { useToast } from "vuestic-ui";

const val = ref<string>("");

const props = defineProps<{
  label: string;
  value: string | undefined;
}>();

const emits = defineEmits<{
  (e: "send-val", val: { label: string; value: string }): void;
}>();

onMounted(() => {
  val.value = props.value ?? "";
});
watch(
  () => props.value,
  (state, prevState) => {
    val.value = state ?? "";
  }
);

watch(val, (state, prevState) => {
  emits("send-val", { label: props.label, value: state });
});

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
  <div class="text-area">
    <div class="label-area">
      <div class="label mb-2 mr-2" @click="copyClipBoard">{{ label }}</div>
      <font-awesome-icon
        class="clipboard-icon"
        icon="fa-regular fa-copy"
        @click="copyClipBoard"
      />
    </div>
    <textarea
      class="text"
      type="textarea"
      v-model="val"
      spellcheck="false"
    ></textarea>
  </div>
</template>

<style lang="scss" scoped>
.text-area {
  font-size: 16px;
  color: rgb(240, 240, 240);
  width: 100%;

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

  .text {
    width: calc(100% - 12px);
    height: 140px;
    color: rgb(240, 240, 240);
    background-color: rgb(54, 54, 54);
    padding: 6px;
    line-height: 26px;
    border-style: double;
    border: 1px solid rgb(129, 129, 129);
    resize: none;

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
      background: #c2c2c2;
    }
  }
}
</style>
