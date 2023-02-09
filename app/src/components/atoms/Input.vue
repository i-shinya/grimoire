<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useToast } from "vuestic-ui";

const props = defineProps<{
  id: number | null; // 必要なら使う
  label: string | null;
  value: string | undefined;
}>();

const val = ref<string>("");

const emits = defineEmits<{
  (e: "send-val", val: { id: number; label: string; value: string }): void;
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
  emits("send-val", {
    id: props.id ?? 0,
    label: props.label ?? "",
    value: state,
  });
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
  <div class="input-area">
    <div class="label-area" v-if="label">
      <div class="label mb-2 mr-2" @click="copyClipBoard">{{ label }}</div>
      <font-awesome-icon
        class="clipboard-icon"
        icon="fa-regular fa-copy"
        @click="copyClipBoard"
      />
    </div>
    <input class="input" type="text" v-model="val" spellcheck="false" />
  </div>
</template>

<style lang="scss" scoped>
.input-area {
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

  .input {
    width: 100%;
    color: rgb(240, 240, 240);
    background-color: rgb(54, 54, 54);
    padding: 0px;
    line-height: 26px;
    border-style: none;
  }
}
</style>
