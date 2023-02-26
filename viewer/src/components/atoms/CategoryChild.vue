<script setup lang="ts">
import { CategoryChild } from "../../core/type/favorite";
import { ref } from "vue";
import { useToast } from "vuestic-ui";

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
  <div class="child-area mb-3">
    <div class="child-label-row">
      <font-awesome-icon
        class="clickable clipboard-icon mr-2"
        icon="fa-regular fa-copy"
        @click="copyClipBoard"
      />
      <p class="clickable child-label" @click="changeValueVisibility">
        {{ child.label }}
      </p>
    </div>
    <p class="child-value mt-3" v-if="showValue" @click="changeValueVisibility">
      {{ child.value }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.child-area {
  font-size: 15px;
  padding: 2px;

  .child-label-row {
    display: flex;

    .child-label {
      user-select: none;
    }
  }

  .child-value {
    padding: 4px 2px;
    border: 1px solid white;
    border-radius: 4px;
  }
}
</style>
