<template>
  <header class="header">
    <a href="https://humantechnopole.it/en/" target="_blank">
      <img :src="htLogoWhite" alt="HT header logo" class="header-logo" />
    </a>
    <template v-if="$slots.default">
      <ht-button-icon
        v-if="!isExpanded"
        aria-controls="primary-header-content"
        icon-type="menu"
        class="menu-button"
        label="Toggle Primary Navigation"
        :aria-expanded="false"
        @click="onClick"
      />
      <ht-button-icon
        v-else
        aria-controls="primary-header-content"
        icon-type="x"
        class="menu-button"
        label="Toggle Primary Navigation"
        :aria-expanded="true"
        @click="onClick"
      />
    </template>
    <div id="primary-header-content" :aria-hidden="!isExpanded">
      <slot></slot>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import htLogoWhite from '../assets/ht-logo-white.svg';

const isExpanded = ref(false);
const mediaQuery = window.matchMedia('(min-width: 50em)'); // matches your CSS media query

const setIsExpanded = () => {
  isExpanded.value = mediaQuery.matches; // true on large screens, false on small screens
};

// Watch for changes in screen size
const handleResize = () => {
  setIsExpanded();
};

onMounted(() => {
  setIsExpanded();
  mediaQuery.addEventListener('change', handleResize);
});

onUnmounted(() => {
  mediaQuery.removeEventListener('change', handleResize);
});

const onClick = () => {
  isExpanded.value = !isExpanded.value;
};
</script>

<style scoped>
.header {
  background-image: var(--ht-color-brand-gradient);
  background-size: cover;
  background-repeat: no-repeat;

  color: white;

  padding-inline: var(--size-3);

  position: relative;

  @media (min-width: 50em) {
    display: grid;
    grid-template-columns: max-content 1fr;
  }
}

#primary-header-content {
  &[aria-hidden='true'] {
    display: none;
  }

  @media (min-width: 50em) {
    &[aria-hidden='false'],
    &[aria-hidden='true'] {
      display: block;
    }
  }
}

.menu-button {
  @media (min-width: 50em) {
    display: none;
  }

  position: absolute;
  right: 1em;
  top: 1.5em;
}

.header-logo {
  height: 2rem;
  margin-block: var(--size-4);
}
</style>
