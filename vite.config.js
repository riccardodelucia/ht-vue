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
    lib: {
      entry: {
        components: path.resolve(__dirname, 'src/components/index.js'),
        auth: path.resolve(__dirname, 'src/authentication/index.js'),
        composables: path.resolve(__dirname, 'src/composables/index.js'),
        utilities: path.resolve(__dirname, 'src/utilities/index.js'),
        api: path.resolve(__dirname, 'src/api/index.js'),
      },
    },
    rollupOptions: {
      external: [
        'vue',
        'vue-feather',
        'vuex',
        'vue-router',
        'keycloak',
        'tippy.js',
        'd3',
      ],
      output: {
        globals: {
          vue: 'Vue',
          'vue-feather': 'VueFeather',
          vuex: 'Vuex',
          'vue-router': 'VueRouter',
          keycloak: 'Keycloak',
          tippy: 'tippy',
          xstate: 'XState',
          lodash: '_',
          deepdash: 'deepdash',
          d3: 'd3',
        },
      },
    },
  },
});
