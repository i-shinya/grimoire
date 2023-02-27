<script setup lang="ts">
import { inject } from "vue";
import { AreaVisibilityKey } from "../store/key";
import VerticalMenuButton from "../components/atoms/VerticalMenuButton.vue";

const areaVisibilityStore = inject(AreaVisibilityKey);
if (!areaVisibilityStore)
  throw new Error("failed to inject store from AreaVisibilityKey");

const showFavoritePromptFrame = () => {
  // TODO 現状コンテンツが一つだけなのでとりあえず連動させている
  areaVisibilityStore.changeRightSideVisibility();
  areaVisibilityStore.changeFavoritePromptFrame();
};
</script>

<template>
  <div class="right-side-menu">
    <div class="button-area">
      <VerticalMenuButton
        class="vertical-menu-button"
        text="favorite prompt"
        icon-type="fa-solid fa-star"
        :isShow="
          areaVisibilityStore.state.rightSideVisibilityState
            .showFavoritePromptFrame
        "
        @click="showFavoritePromptFrame"
      ></VerticalMenuButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../variables" as var;

.right-side-menu {
  width: var.$right-sidemenu-width;
  background-color: rgb(73, 73, 73);

  .button-area {
    .vertical-menu-button {
    }
  }
}
</style>
