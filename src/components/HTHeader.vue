<template>
  <div class="header-container">
    <header class="header" :class="[isWeb ? 'web-container' : '']">
      <HTMenuButton v-if="showMenuButton" v-bind="$attrs"></HTMenuButton>
      <a href="https://humantechnopole.it/en/" target="_blank"
        ><img :src="htLogoWhite" alt="HT logo" class="header__logo"
      /></a>
      <slot name="logo"></slot>
      <nav class="header__nav">
        <slot name="nav"></slot>
      </nav>
    </header>
  </div>
</template>

<script>
import htLogoWhite from '../assets/ht-logo-white.svg';
import HTMenuButton from './HTMenuButton.vue';

export default {
  name: 'HTHeader',
  components: { HTMenuButton },
  inheritAttrs: false,
  props: {
    isWeb: {
      type: Boolean,
      default: false,
    },
    showMenuButton: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      htLogoWhite,
    };
  },
};
</script>
