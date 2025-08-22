import { createApp } from 'vue';

import '@nf-data-iu3/ht-design/style.css';

import { HTVue } from './src/plugin.js';

import App from './App.vue';

const app = createApp(App).use(HTVue);

app.mount('#app');
