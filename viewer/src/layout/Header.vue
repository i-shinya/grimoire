<script setup lang="ts">
import { WindowAPI, WindowAPIFromNode } from "../core/api/window";

const windowAPI: WindowAPI = new WindowAPIFromNode();

const closeWindow = () => {
  windowAPI.closeWindow();
};

const resizeWindow = () => {
  windowAPI.resizeWindow();
};

const minimizeWindow = () => {
  windowAPI.minimizeWindow();
};
</script>

<template>
  <div id="header">
    <div class="logo-area">
      <p class="header-text">Grimoire</p>
    </div>
    <div class="button-area">
      <font-awesome-icon
        class="window-operate-button"
        icon="fa-regular fa-window-minimize"
        @click="minimizeWindow()"
      />
      <font-awesome-icon
        class="window-operate-button"
        icon="fa-regular fa-square"
        @click="resizeWindow()"
      />
      <font-awesome-icon
        class="window-operate-button"
        icon="fa-solid fa-xmark"
        @click="closeWindow()"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../variables.scss" as var;

#header {
  color: rgb(197, 197, 197);
  background-color: rgb(76, 72, 97);
  height: var.$header-height;
  width: 100%;
  position: fixed;
  top: 0;
  display: flex;
  align-items: center;
  -webkit-app-region: drag; // windowをドラッグで移動させるために必要

  .logo-area {
    font-size: 18px;
    padding-left: 20px;
    justify-content: flex-start;
  }

  .button-area {
    font-size: 20px;
    margin-left: auto;
    display: flex;

    .window-operate-button {
      padding-right: 20px;
      -webkit-app-region: no-drag; // 親要素でdragを指定しているとno-drag指定しないとクリックできない
    }
  }

  .footer-text {
    text-align: center;
  }
}
</style>
