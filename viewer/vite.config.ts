import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// 環境変数からビルドモードを変更してdistの配置を変える
let outDir: string;
if (process.env.VITE_BUILD_MODE === "demo") {
  outDir = "./dist";
} else if (process.env.VITE_BUILD_MODE === "electron") {
  outDir = "../electron/dist";
} else {
  console.log("[WARN] process.env.VITE_BUILD_MODE is not found");
  outDir = "";
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "./", //add base path
  server: {
    port: 3000,
  },
  build: {
    // electron以外の場合は変えたりしたら良いかも
    outDir: outDir,
  },
});
