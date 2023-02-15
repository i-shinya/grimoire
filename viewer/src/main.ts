import { createApp } from "vue";
import "./style.css";
// electron用のtsconfigの設定のせいで
// @ts-ignore
import App from "./App.vue";
import { createVuestic } from "vuestic-ui";
import "vuestic-ui/css";
import "material-design-icons-iconfont/dist/material-design-icons.min.css";

// splitpanes用
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faUserSecret,
  faFolderOpen,
  faMagnifyingGlass,
  faAngleRight,
  faAngleDown,
  faAngleUp,
  faXmark,
  faTerminal,
  faArrowUpWideShort,
  faArrowDownWideShort,
  faPlus,
  faArrowRotateRight,
  faList,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import {
  faCopy,
  faSquare,
  faWindowMinimize,
  faCircleUp,
} from "@fortawesome/free-regular-svg-icons";
import {
  DirectoryAPI,
  DirectoryAPIKey,
  DirectoryDemoAPI,
  DirectoryNodeAPI,
} from "./core/api/directory";
import {
  WindowAPI,
  WindowAPIKey,
  WindowDemoAPI,
  WindowNodeAPI,
} from "./core/api/window";

// 使用するfont-awesomeアイコンを読み込む
library.add(
  faUserSecret,
  faFolderOpen,
  faMagnifyingGlass,
  faAngleRight,
  faAngleDown,
  faAngleUp,
  faCopy,
  faXmark,
  faSquare,
  faWindowMinimize,
  faTerminal,
  faCircleUp,
  faArrowUpWideShort,
  faArrowDownWideShort,
  faPlus,
  faMinus,
  faArrowRotateRight,
  faList
);

let directoryAPI: DirectoryAPI;
let windowAPI: WindowAPI;
switch (import.meta.env.VITE_BUILD_MODE) {
  case "demo":
    directoryAPI = new DirectoryDemoAPI();
    windowAPI = new WindowDemoAPI();
    break;
  case "electron":
    directoryAPI = new DirectoryNodeAPI();
    windowAPI = new WindowNodeAPI();
    break;
  default:
    console.log("[WARN] import.meta.env.VITE_BUILD_MODE is not found");
    directoryAPI = new DirectoryNodeAPI();
    windowAPI = new WindowNodeAPI();
    break;
}

createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .component("Splitpanes", Splitpanes)
  .component("Pane", Pane)
  .provide<DirectoryAPI>(DirectoryAPIKey, directoryAPI)
  .provide<WindowAPI>(WindowAPIKey, windowAPI)
  .use(createVuestic())
  .mount("#app");
