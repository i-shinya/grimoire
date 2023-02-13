import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "./", //add base path
  server: {
    port: 3000,
  },
  build: {
    // electron以外の場合は変えたりしたら良いかも
    outDir: "../electron/dist"
  },
});
