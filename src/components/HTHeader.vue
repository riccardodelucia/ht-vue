<template>
  <header class="header">
    <a href="https://humantechnopole.it/en/" target="_blank">
      <img :src="htLogoWhite" alt="HT header logo" class="header-logo" />
    </a>
    <template v-if="$slots.default">
      <HTButtonIcon
        v-if="!isExpanded"
        aria-controls="primary-header-content"
        icon-type="menu"
        class="menu-button"
        label="Toggle Primary Navigation"
        :aria-expanded="false"
        @click="onClick"
      ></HTButtonIcon>
      <HTButtonIcon
        v-else
        aria-controls="primary-header-content"
        icon-type="x"
        class="menu-button"
        label="Toggle Primary Navigation"
        :aria-expanded="true"
        @click="onClick"
      ></HTButtonIcon>
    </template>
    <div id="primary-header-content" :aria-hidden="!isExpanded">
      <slot></slot>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import htLogoWhite from '../assets/ht-logo-white.svg';
import HTButtonIcon from './HTButtonIcon.vue';

const isExpanded = ref(false);

const onClick = () => {
  isExpanded.value = !isExpanded.value;
};
</script>

<style lang="postcss" scoped>
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
