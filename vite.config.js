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
        index: path.resolve(__dirname, 'src/index.js'),
      },
      name: 'HTVue',
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
        assetFileNames: (assetInfo) => {
          const fileName = assetInfo.name || assetInfo.names?.[0]; // Support `name` and `names`
          if (fileName && fileName.endsWith('.css')) {
            return 'style.css'; // Rename CSS files to style.css
          }
          return '[name].[ext]'; // Default naming for other assets
        },
        //chunkFileNames: 'allComponents.[hash].js',
      },
    },
  },
});
