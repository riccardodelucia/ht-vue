import { createApp } from 'vue';

import '@nf-data-iu3/ht-design/style.css';

import VueFeather from 'vue-feather';

import { HTVue } from './lib/plugin.js';

import App from './App.vue';

const app = createApp(App).use(HTVue);

app.component(VueFeather.name, VueFeather);

app.mount('#app');
