import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import renderer from "vite-plugin-electron-renderer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    renderer({
      nodeIntegration: true, // FIXME レンダラープロセスでnode.jsを使えるようにするのは非推奨
    }),
  ],
  base: "./", //add base path
  server: {
    port: 3000,
  },
});
