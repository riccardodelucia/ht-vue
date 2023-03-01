import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: true,
    lib: {
      entry: {
        index: path.resolve(__dirname, 'src/index.js'),
        components: path.resolve(__dirname, 'src/components/components.js'),
      },
    },
    rollupOptions: {
      // I'm keeping external and output.globals in sync
      external: [
        'vue',
        'vue-router',
        'd3',
        'xstate',
        'lodash',
        'deepdash-es',
        'vue-feather',
      ],
      output: {
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
          d3: 'd3',
          xstate: 'XState',
          lodash: '_',
          'deepdash-es': 'deepdash',
          'vue-feather': 'VueFeather',
        },
        chunkFileNames: 'allComponents.[hash].js',
      },
    },
  },
});
