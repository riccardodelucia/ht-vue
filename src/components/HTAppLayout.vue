<template>
  <div class="layout-app">
    <div class="layout-app__header">
      <slot name="header"></slot>
    </div>
    <div class="layout-app__sidenav">
      <slot name="sidenav"></slot>
    </div>
    <div class="layout-app__content"><slot></slot></div>
  </div>
</template>

<script>
import { resizeListener } from '@/composables/index.js';
import { ref } from 'vue';

export default {
  name: 'HTAppLayout',
  props: {
    sidenavObject: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    const collapse = ref(false);
    const showSideNav = ref(false);

    resizeListener(() => (collapse.value = window.innerWidth < 1100));

    const manageSidenav = (value) => {
      showSideNav.value = value;
      const body = document.querySelector('body');
      body.style.overflow = value ? 'hidden' : 'auto';
    };

    return {
      collapse,
      showSideNav,
      manageSidenav,
    };
  },
};
</script>
