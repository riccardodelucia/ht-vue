<template>
  <aside class="sidenav">
    <div class="sidenav__title">{{ sidenavObject.title }}</div>
    <ul class="sidenav__list">
      <li
        v-for="link in sidenavObject.links"
        :key="link.id"
        class="sidenav__item"
        :class="{ 'sidenav__item--active': $route.path.includes(link.url) }"
        @click="linkClick(link.url)"
      >
        <span>{{ link.label }}</span>
      </li>
    </ul>
  </aside>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  name: 'HTSidenav',
  props: {
    sidenavObject: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    const router = useRouter();

    const linkClick = (url) => {
      router.push(url);
    };

    return {
      linkClick,
    };
  },
};
</script>
