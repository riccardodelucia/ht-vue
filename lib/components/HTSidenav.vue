<template>
  <aside class="sidenav">
    <a class="logo" href="https://humantechnopole.it/en/" target="_blank"
      ><img :src="htLogoWhite" alt="HT logo"
    /></a>
    <h2>{{ sidenavObject.title }}</h2>
    <ul class="ht-reset sidenav-list">
      <li v-for="link in sidenavObject.links" :key="link.id">
        <RouterLink active-class="active" :to="link.url">
          <VueFeather :type="link.type || 'chevron-right'"></VueFeather
          ><span>{{ link.label }}</span>
        </RouterLink>
      </li>
    </ul>
  </aside>
</template>

<script>
import VueFeather from 'vue-feather';
import { RouterLink } from 'vue-router';

import htLogoWhite from '../assets/ht-logo-white.svg';

export default {
  name: 'HTSidenav',
  components: { VueFeather, RouterLink },
  props: {
    sidenavObject: {
      type: Object,
      default: () => ({}),
    },
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

  li {
    > a {
      display: flex;
      align-items: center;
      gap: var(--size-3);
      padding: var(--size-2);
      margin-bottom: var(--size-1);
      cursor: pointer;

      text-decoration: none;
      color: white;

      &:not(&.active):hover,
      &:not(&.active):focus,
      &.active {
        background-color: var(--ht-color-secondary);

        span {
          transform: translateX(0.5em);
          transition: transform 0.3s ease-in-out;
        }
      }

      > * {
        flex-shrink: 0;
      }

      span {
        transition: transform 0.3s ease-in-out;
      }
    }
  }
}
</style>
