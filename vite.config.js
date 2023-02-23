import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
// test
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './lib'),
    },
  },
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, 'lib/components/index.js'),
        components: path.resolve(__dirname, 'lib/components/index.js'),
        auth: path.resolve(__dirname, 'lib/auth/index.js'),
        utilities: path.resolve(__dirname, 'lib/utilities/index.js'),
        api: path.resolve(__dirname, 'lib/api/index.js'),
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
