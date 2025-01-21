<template>
  <nav class="sidenav">
    <a class="logo" href="https://humantechnopole.it/en/" target="_blank"
      ><img :src="htLogoWhite" alt="HT logo"
    /></a>
    <h2>{{ title }}</h2>
    <ul v-if="links.length > 0" class="sidenav-list">
      <li class="sidenav-link" v-for="(link, idx) in links" :key="idx">
        <RouterLink active-class="active" :to="link.to">
          <VueFeather :type="link.icon"></VueFeather
          ><span>{{ link.label }}</span>
        </RouterLink>
      </li>
    </ul>
    <!-- Us this slot if you want to override the default render behavior of the sidenav -->
    <slot name="sidenav-content"></slot>
  </nav>
</template>

<script>
import htLogoWhite from '../assets/ht-logo-white.svg';

export default {
  name: 'HTSidenav',
  props: {
    title: { type: String, default: 'Test' },
    links: { type: Array, default: [] },
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
    padding-inline: var(--size-3);
    margin-bottom: var(--size-2);
    font-size: var(--font-size-3);
    font-weight: var(--font-weight-5);
  }
}

.logo {
  display: block;
  width: 9rem;
  padding-inline: var(--size-3);
  margin-bottom: var(--size-3);
}

.sidenav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidenav-link > a {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  padding: var(--size-2);
  gap: var(--size-3);
  cursor: pointer;
  color: white;
  text-decoration: none;

  &.active {
    background-color: var(--ht-color-secondary);
  }

  &:not(.active):hover {
    background-color: var(--ht-color-secondary);
  }

  &:not(.active):hover span {
    transform: translateX(0.5em);
  }

  & > span {
    transition: transform 0.3s ease-in-out;
  }
}
</style>
