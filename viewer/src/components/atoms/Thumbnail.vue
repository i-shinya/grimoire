<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { ImageDetail, ThumbnailSize } from "../../core/type/image";

const props = defineProps<{
  image: ImageDetail;
  isSelect: boolean;
  getImage: (filename: string) => Promise<string>;
}>();

const emits = defineEmits<{
  (e: "send-data-url", dataUrl: string): void;
}>();

// 画像のサイズのmax値を計算
const maxImageSize = computed(() => {
  if (
    !props.image.meta ||
    !props.image.meta.width ||
    !props.image.meta.height
  ) {
    return "";
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

onMounted(() => {
  if (!props.image.dataUrl) {
    props.getImage(props.image.label).then((res: string) => {
      emits("send-data-url", res);
    });
  }
});
</script>

<template>
  <div class="image-area">
    <img
      :id="image.label"
      class="image"
      :class="isSelect ? 'is-selected-image' : ''"
      :src="image.dataUrl"
      loading="lazy"
      :draggable="true"
      :style="maxImageSize"
    />
    <div class="image-label">{{ image.label }}</div>
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

    &.is-selected-image {
      border: 2px solid rgb(150, 161, 109);
    }
  }
  .image-label {
    padding-top: 4px;
    font-size: 16px;
    text-align: center;
  }
}
</style>
