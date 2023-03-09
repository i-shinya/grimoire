<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ImageDetail, ThumbnailSize } from "../../core/type/image";

const props = defineProps<{
  image: ImageDetail;
  thumbnailSize: ThumbnailSize;
  isSelect: boolean;
  getImage: (filename: string) => Promise<string>;
}>();

const emits = defineEmits<{
  (e: "select-image", image: ImageDetail): void;
}>();

const dataUrl = ref<string>();

const selectImage = () => {
  emits("select-image", props.image);
};

onMounted(() => {
  props.getImage(props.image.label).then((res) => {
    dataUrl.value = res;
  });
});
</script>

<template>
  <div class="image-area" :class="thumbnailSize" @click="selectImage">
    <img
      :id="image.label"
      class="image"
      :class="[isSelect ? 'is-selected-image' : '', thumbnailSize]"
      :src="dataUrl"
      loading="lazy"
      :draggable="true"
    />
    <div class="image-label">{{ image.label }}</div>
  </div>
</template>

<style lang="scss" scoped>
.image-area {
  color: white;
  max-height: 30%;
  padding: 8px;
  cursor: pointer;

  // サムネイルサイズ、storeに保存されている値
  &.small {
    max-width: 136px;
    width: 136px;
    min-width: 136px;
  }
  &.default {
    max-width: 256px;
    width: 256px;
    min-width: 256px;
  }
  &.big {
    max-width: 376px;
    width: 376px;
    min-width: 376px;
  }

  .image {
    height: auto;

    // サムネイルサイズ、storeに保存されている値
    &.small {
      max-width: 120px;
      width: 120px;
      min-width: 120px;
    }
    &.default {
      max-width: 240px;
      width: 240px;
      min-width: 240px;
    }
    &.big {
      max-width: 360px;
      width: 360px;
      min-width: 360px;
    }

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
