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
        components: path.resolve(__dirname, 'lib/components/components.js'),
        auth: path.resolve(__dirname, 'lib/auth/index.js'),
        utilities: path.resolve(__dirname, 'lib/utilities/index.js'),
        api: path.resolve(__dirname, 'lib/api/index.js'),
      },
    },
    rollupOptions: {
      external: [
        'vue',
        'vue-feather',
        'vue-router',
        'keycloak-js',
        'tippy.js',
        'd3',
        'xstate',
      ],
      output: {
        globals: {
          vue: 'Vue',
          'vue-feather': 'VueFeather',
          vuex: 'Vuex',
          'vue-router': 'VueRouter',
          'keycloak-js': 'Keycloak',
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
