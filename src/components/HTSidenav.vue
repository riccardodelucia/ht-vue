<template>
  <aside class="sidenav">
    <b>{{ sidenavObject.title }}</b>
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
    <div v-if="showHide" class="sidenav__hide-button">
      <span>hide</span>
      <vue-feather type="chevrons-left"></vue-feather>
    </div>
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
    showHide: {
      type: Boolean,
      default: false,
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
