<template>
  <header class="header">
    <a href="https://humantechnopole.it/en/" target="_blank"
      ><img :src="htLogoWhite" alt="HT logo" class="logo"
    /></a>
    <HTButtonIcon
      v-if="$slots.default"
      aria-controls="primary-navigation"
      icon-type="menu"
      class="menu-button"
      label="Toggle Primary Navigation"
      :aria-expanded="isExpanded"
      @click="onClick"
    ></HTButtonIcon>
    <div
      id="primary-navigation"
      class="header__slot"
      :aria-hidden="!isExpanded"
    >
      <slot></slot>
    </div>
  </header>
</template>

<script>
import { ref } from 'vue';
import htLogoWhite from '../assets/ht-logo-white.svg';
import HTButtonIcon from './HTButtonIcon.vue';

export default {
  name: 'HTHeaderWeb',
  components: { HTButtonIcon },
  setup() {
    const isExpanded = ref(true);

    const onClick = () => {
      isExpanded.value = !isExpanded.value;
    };

    return {
      htLogoWhite,
      onClick,
      isExpanded,
    };
  },
};
</script>

<style lang="postcss" scoped>
.header {
  background-image: var(--ht-color-brand-gradient);
  background-size: cover;
  background-repeat: no-repeat;

  color: white;

  padding-inline: var(--size-3);

  display: flex;
  align-items: center;
  flex-direction: column;

  gap: var(--size-4);

  position: relative;

  @media (min-width: 50em) {
    flex-direction: row;
  }

  a:first-child {
    align-self: flex-start;

    @media (min-width: 50em) {
      align-self: center;
    }
  }

  &__slot {
    flex-grow: 1;
    align-self: stretch;

    &[aria-hidden='false'] {
      display: none;
    }

    @media (min-width: 50em) {
      &[aria-hidden='false'],
      &[aria-hidden='true'] {
        display: block;
      }
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

.logo {
  width: auto;
  height: 2rem;
  margin-block: var(--size-4);
}
</style>
