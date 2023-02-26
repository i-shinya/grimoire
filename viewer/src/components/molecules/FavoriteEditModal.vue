<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { Favorite } from "../../core/type/favorite";

const props = defineProps<{
  favorite: Favorite;
}>();

const emits = defineEmits<{
  (e: "save", favorite: Favorite): void;
  (e: "cancel"): void;
}>();

const inputFavorite = ref<Favorite>();

const saveModal = () => {
  emits("save", inputFavorite.value!!);
};
const cancelModal = () => {
  emits("cancel");
};

const editorShortcutKey = (event: KeyboardEvent) => {
  if (event.code === "Escape") {
    emits("cancel");
  }
};

onMounted(() => {
  inputFavorite.value = props.favorite;
  document.addEventListener("keydown", editorShortcutKey);
});
onBeforeUnmount(() => {
  document.removeEventListener("keydown", editorShortcutKey);
});
</script>

<template>
  <div class="modal-area">
    <div class="modal-header">へっだーだよ</div>
    <div class="modal-contents" v-if="inputFavorite">
      <template v-for="category in inputFavorite.categories">
        <div class="category-area">
          <div class="category-input">
            <input :value="category.label" />
            <font-awesome-icon class="clickable" icon="fa-solid fa-trash-can" />
          </div>
          <template v-for="child in category.children">
            <div class="child-input">
              <input :value="child.label" />
              <input :value="child.value" />
              <font-awesome-icon
                class="clickable"
                icon="fa-solid fa-trash-can"
              />
            </div>
          </template>
          <div>child追加ボタン</div>
        </div>
      </template>
      <div class="category-area">
        <div class="category-input">
          <input value="category1" />
          <font-awesome-icon class="clickable" icon="fa-solid fa-trash-can" />
        </div>
        <div class="child-input">
          <input value="child1 label" />
          <input value="child1 value" />
          <font-awesome-icon class="clickable" icon="fa-solid fa-trash-can" />
        </div>
        <div>child追加ボタン</div>
      </div>
      <div>カテゴリ追加ボタン</div>
    </div>
    <div class="modal-footer">
      <div class="cancel-button" @click="cancelModal">cancel</div>
      <div class="save-button" @click="saveModal">save</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$modal-width: 600px;
$modal-height: 400px;

.modal-area {
  height: $modal-height;
  width: $modal-width;
  position: fixed;
  top: calc(50vh - calc($modal-height / 2));
  left: calc(50vw - calc($modal-width / 2));
  border: 1px solid white;
  background-color: #100615;
  padding: 16px;

  .modal-header {
    text-align: center;
    width: 100%;
  }

  .modal-footer {
    display: flex;
    justify-content: center;
    width: 100%;
  }
}
</style>
