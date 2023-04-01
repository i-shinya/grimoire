<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { ImageDetail } from "../../core/type/image";
import Thumbnail from "../atoms/Thumbnail.vue";
import { useToast } from "vuestic-ui";

const props = defineProps<{
  defaultImage: ImageDetail | null;
  images: ImageDetail[];
  show: boolean;
  getImage: (filename: string) => Promise<string>;
  checkedImages: { id: number; isChecked: boolean; filename: string }[];
}>();

const emits = defineEmits<{
  (e: "hide-modal"): void;
  (e: "send-checked-change", id: number, isChecked: boolean): void;
}>();

const mainImage = ref<ImageDetail | null>(null);
const showModal = ref(false);

const showNextImage = () => {
  if (!mainImage.value) return;
  const index = props.images.findIndex(
    (image) => image.id === mainImage.value?.id
  );
  if (index < props.images.length - 1) {
    mainImage.value = props.images[index + 1];
  }
};

const showPreviousImage = () => {
  if (!mainImage.value) return;
  const index = props.images.findIndex(
    (image) => image.id === mainImage.value?.id
  );
  if (index > 0) {
    mainImage.value = props.images[index - 1];
  }
};

const shortcutKey = (event: KeyboardEvent) => {
  if (event.code === "ArrowRight") {
    showNextImage();
  } else if (event.code === "ArrowLeft") {
    showPreviousImage();
  }
};

const { init } = useToast();
const copyImageToClipboard = async () => {
  // dataUrlをblobに変換してクリップボードにコピー
  if (!mainImage.value?.dataUrl) {
    return;
  }
  const res = await fetch(mainImage.value.dataUrl);
  const blob = await res.blob();
  navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]).then(
    () => {
      /* clipboard successfully set */
      init({
        closeable: false,
        color: "#FFFFFF",
        message: `Copy Image to Clipboard !!`,
        duration: 1000,
      });
    },
    () => {
      /* clipboard write failed */
    }
  );
};

onMounted(() => {
  mainImage.value = props.defaultImage;
  showModal.value = props.show;
  document.addEventListener("keydown", shortcutKey);
});
onBeforeUnmount(() => {
  document.removeEventListener("keydown", shortcutKey);
});

watch(
  () => props.show,
  (val) => {
    showModal.value = val;
  }
);
watch(showModal, (val) => {
  if (!val) {
    emits("hide-modal");
  }
});
</script>

<template>
  <va-modal
    ref="modal"
    v-model="showModal"
    max-width="94vw"
    background-color="#dcdcdc"
    :hide-default-actions="true"
  >
    <div class="modal-content">
      <div class="main-image-area">
        <font-awesome-icon
          class="arrow-icon clickable"
          icon="fa-solid fa-angle-left"
          @click="showPreviousImage"
        />
        <div v-if="mainImage">
          <Thumbnail
            class="main-image"
            :image="mainImage"
            :isSelect="false"
            :isChecked="
              checkedImages.find((v) => v.id === mainImage?.id)?.isChecked
            "
            :getImage="getImage"
            @sendClick="copyImageToClipboard"
            @sendCheckedChange="(isChecked: boolean) =>
              emits('send-checked-change', mainImage!!.id, isChecked)
            "
          ></Thumbnail>
        </div>
        <font-awesome-icon
          class="arrow-icon clickable"
          icon="fa-solid fa-angle-right"
          @click="showNextImage"
        />
      </div>
      <div class="image-slider"></div>
    </div>
  </va-modal>
</template>

<style lang="scss" scoped>
.modal-content {
  .main-image-area {
    display: flex;
    align-items: center;

    .arrow-icon {
      font-size: 20px;
      padding: 12px;
    }

    .main-image {
      max-width: 80vw;
      width: 80vw;
      min-width: 80vw;
    }
  }
}
</style>
