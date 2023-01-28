import { createApp } from "vue";
import "./style.css";
// electron用のtsconfigの設定のせいで
// @ts-ignore
import App from "./App.vue";

createApp(App).mount("#app");
