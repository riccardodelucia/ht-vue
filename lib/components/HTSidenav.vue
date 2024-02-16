<template>
  <aside class="sidenav">
    <a class="logo" href="https://humantechnopole.it/en/" target="_blank"
      ><img :src="htLogoWhite" alt="HT logo"
    /></a>
    <h2>{{ title }}</h2>
    <ul class="ht-reset sidenav-list">
      <slot name="sidenav-list"></slot>
    </ul>
  </aside>
</template>

<script>
import htLogoWhite from '../assets/ht-logo-white.svg';

export default {
  name: 'HTSidenav',

  props: {
    title: { type: String, default: 'Test' },
  },
  setup() {
    return {
      htLogoWhite,
    };
  },
};
</script>

<style lang="postcss" scoped>
.sidenav {
  background-color: var(--ht-color-brand-blue-1);
  width: 16rem;
  min-height: 100vh;
  color: white;
  padding-block: var(--size-3);

  h2 {
    padding-inline: var(--size-2);
    margin-bottom: var(--size-2);
    font-size: var(--font-size-3);
    font-weight: var(--font-weight-5);
  }
}

.logo {
  display: block;
  width: 9rem;
  padding-inline: var(--size-2);
  margin-bottom: var(--size-3);
}

.sidenav-list {
  list-style: none;
}
</style>
