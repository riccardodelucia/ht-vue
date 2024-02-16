import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    sourcemap: true,
    lib: {
      entry: {
        index: path.resolve(__dirname, 'lib/index.js'),
        components: path.resolve(__dirname, 'lib/components/components.js'),
        layouts: path.resolve(__dirname, 'lib/layouts/layouts.js'),
      },
    },
    rollupOptions: {
      // I'm keeping external and output.globals in sync
      external: ['vue', 'd3', 'lodash', 'deepdash-es', 'vue-feather'],
      output: {
        globals: {
          vue: 'Vue',
          d3: 'd3',
          lodash: '_',
          'deepdash-es': 'deepdash',
          'vue-feather': 'VueFeather',
        },
        chunkFileNames: 'allComponents.[hash].js',
      },
    },
  },
});
