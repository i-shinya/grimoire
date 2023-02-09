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
} from "@fortawesome/free-solid-svg-icons";
import {
  faCopy,
  faSquare,
  faWindowMinimize,
  faCircleUp,
} from "@fortawesome/free-regular-svg-icons";

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
  faArrowDownWideShort
);

createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .component("Splitpanes", Splitpanes)
  .component("Pane", Pane)
  .use(createVuestic())
  .mount("#app");
