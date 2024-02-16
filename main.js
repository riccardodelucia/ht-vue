import { createApp } from 'vue';

import '@computational-biology-sw-web-dev-unit/ht-design/style.css';

import VueFeather from 'vue-feather';

import { HTVue } from './lib/plugin.js';

import App from './App.vue';

const app = createApp(App).use(HTVue);

app.component(VueFeather.name, VueFeather);

app.mount('#app');
