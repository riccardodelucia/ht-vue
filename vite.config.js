import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.js"),
      name: "VueHTComponents",
      fileName: "vue-ht-components",
    },
    rollupOptions: {
      external: ["vue", "vue-feather", "vuex", "vue-router"],
      output: {
        globals: {
          vue: "Vue",
          "vue-feather": "VueFeather",
          vuex: "Vuex",
          "vue-router": "VueRouter",
        },
      },
    },
  },
});
