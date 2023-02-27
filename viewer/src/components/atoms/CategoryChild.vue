<script setup lang="ts">
import { CategoryChild } from "../../core/type/favorite";
import { ref } from "vue";
import { useToast } from "vuestic-ui";
import Property from "./Property.vue";

const props = defineProps<{
  child: CategoryChild;
}>();

const showValue = ref<boolean>(false);

const changeValueVisibility = () => {
  showValue.value = !showValue.value;
};

const { init } = useToast();
const copyClipBoard = () => {
  const text = props.child.value.toString() ?? "";
  navigator.clipboard.writeText(text).then(
    () => {
      /* clipboard successfully set */
      init({
        closeable: false,
        color: "#FFFFFF",
        message: `Copy ${props.child.label} to Clipboard !!`,
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
  <div class="child-area">
    <font-awesome-icon class="star-icon" icon="fa-solid fa-star" />
    <Property
      class="mb-2"
      :label="child.label"
      :shortcutText="null"
      :value="child.value"
    ></Property>
  </div>
</template>

<style lang="scss" scoped>
.child-area {
  font-size: 15px;
  padding: 2px;
  display: flex;

  .star-icon {
    padding-top: 2px;
    font-size: 11px;
  }
}
</style>
