<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { ImageDetail } from "../../core/type/image";

const props = defineProps<{
  image: ImageDetail;
  isSelect: boolean;
  isChecked: boolean;
  getImage: (filename: string) => Promise<string>;
}>();

const emits = defineEmits<{
  (e: "send-data-url", dataUrl: string): void;
  (e: "send-checked-change", isChecked: boolean): void;
  (e: "send-click"): void;
  (e: "send-dblclick"): void;
}>();

const isCheckedRef = ref(false);

// 画像のサイズのmax値を計算
const maxImageSize = computed(() => {
  if (
    !props.image.meta ||
    !props.image.meta.width ||
    !props.image.meta.height
  ) {
    return "max-height: 80vh;";
  }

  const maxWidth =
    window.innerWidth * 0.8 > props.image.meta.width
      ? props.image.meta.width
      : window.innerWidth * 0.8;
  const maxHeight =
    window.innerHeight * 0.8 > props.image.meta.height
      ? props.image.meta.height
      : window.innerHeight * 0.8;

  return `max-width: ${maxWidth}px; max-height: ${maxHeight}px;`;
});

const changeCheck = () => {
  emits("send-checked-change", isCheckedRef.value);
};

// label.forでチェックボックスのチェックと関連付けると同じコンポーネントを使っている場合にバグるのでクリックイベントにした
const clickLabel = () => {
  isCheckedRef.value = !isCheckedRef.value;
  emits("send-checked-change", isCheckedRef.value);
};

onMounted(() => {
  if (!props.image.dataUrl) {
    props.getImage(props.image.label).then((res: string) => {
      emits("send-data-url", res);
    });
  }
});

watch(
  () => props.isChecked,
  (state) => {
    isCheckedRef.value = state;
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <div class="image-area">
    <img
      :id="image.label"
      alt="ai illustration"
      class="image"
      :class="isSelect ? 'is-selected-image' : ''"
      :src="image.dataUrl"
      loading="lazy"
      :draggable="true"
      :style="maxImageSize"
      @click="emits('send-click')"
      @dblclick="emits('send-dblclick')"
    />
    <div class="label-area">
      <input
        :id="`check-box-${image.id}`"
        class="mr-2"
        type="checkbox"
        v-model="isCheckedRef"
        @change="changeCheck"
      />
      <label class="image-label" @click="clickLabel">{{ image.label }}</label>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.image-area {
  padding: 8px;
  cursor: pointer;
  width: 100%;
  text-align: center;

  .image {
    height: auto;
    width: 100%;
    object-fit: contain;

    &.is-selected-image {
      border: 2px solid rgb(150, 161, 109);
    }
  }

  .label-area {
    display: flex;
    justify-content: center;

    .image-label {
      padding-top: 4px;
      font-size: 16px;
      text-align: center;
    }
  }
}
</style>
