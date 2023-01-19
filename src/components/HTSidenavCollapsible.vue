<template>
  <template v-if="showController">
    <div class="sidenav-controller">
      <div class="sidenav-controller__menu" @click="manageSidenav(true)">
        <div class="sidenav-controller__button"></div>
      </div>
    </div>
    <div
      class="sidenav-controller__sidenav"
      :class="sidenavVisible && 'sidenav-controller__sidenav--visible'"
    >
      <ht-sidenav
        :sidenav-object="sidenavObject"
        @click="manageSidenav(false)"
      ></ht-sidenav>
    </div>
    <div
      v-if="sidenavVisible"
      class="overlay"
      @click="manageSidenav(false)"
    ></div
  ></template>
  <ht-sidenav v-else :sidenav-object="sidenavObject"></ht-sidenav>
</template>

<script>
import { ref } from 'vue';
import { resizeListener } from '@/composables/index.js';

export default {
  name: 'HTSidenavCollapsible',
  props: {
    sidenavObject: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    const sidenavVisible = ref(false);

    const showController = ref(false);

    resizeListener(() => (showController.value = window.innerWidth < 1100));

    const manageSidenav = (value) => {
      sidenavVisible.value = value;
      const body = document.querySelector('body');
      body.style.overflow = value ? 'hidden' : 'auto';
    };

    return { sidenavVisible, manageSidenav, showController };
  },
};
</script>
