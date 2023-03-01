<script setup lang="ts">
import { inject } from "vue";
import { AreaVisibilityKey } from "../store/key";
import VerticalMenuButton from "../components/atoms/VerticalMenuButton.vue";
import { WindowAPIKey } from "../core/api/window";

const areaVisibilityStore = inject(AreaVisibilityKey);
if (!areaVisibilityStore)
  throw new Error("failed to inject store from AreaVisibilityKey");
const windowAPI = inject(WindowAPIKey);
if (!windowAPI) throw new Error("failed to inject windowAPI from WindowAPIKey");

const showFavoritePromptFrame = () => {
  // TODO 現状コンテンツが一つだけなのでとりあえず連動させている
  areaVisibilityStore.changeRightSideVisibility();
  areaVisibilityStore.changeFavoritePromptFrame();
};

const showDeepLWindow = async () => {
  await windowAPI.showChildWindow("https://www.deepl.com");
};
const showChatGpt = async () => {
  await windowAPI.showChildWindow("https://chat.openai.com/chat");
};
</script>

<template>
  <div class="right-side-menu">
    <div class="button-area">
      <div class="top-icon-area">
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

      <div class="bottom-icon-area">
        <VerticalMenuButton
          class="vertical-menu-button"
          text="DeepL"
          icon-type="fa-brands fa-chrome"
          :isShow="false"
          @click="showDeepLWindow"
        ></VerticalMenuButton>
        <VerticalMenuButton
          class="vertical-menu-button"
          text="ChatGPT"
          icon-type="fa-brands fa-chrome"
          :isShow="false"
          @click="showChatGtp"
        ></VerticalMenuButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../variables" as var;

.right-side-menu {
  width: var.$right-sidemenu-width;
  background-color: rgb(73, 73, 73);

  .button-area {
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: space-between;
  }
}
</style>
