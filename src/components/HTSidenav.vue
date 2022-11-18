<template>
  <div v-if="collapsible" class="sidenav-controller">
    <div class="sidenav-controller__menu" @click="manageSidenav(true)">
      <div class="menu__item"></div>
    </div>
  </div>
  <div
    v-if="showSideNav && collapsible"
    class="overlay"
    @click="manageSidenav(false)"
  ></div>

  <nav
    class="sidenav"
    :class="{
      'sidenav--collapsible': collapsible,
      'sidenav--active': showSideNav,
    }"
  >
    <div class="sidenav__title">{{ sidenavObject.title }}</div>
    <ul class="sidenav__list">
      <li
        v-for="link in sidenavObject.links"
        :key="link.id"
        class="sidenav__item"
        :class="{ 'sidenav__item--active': $route.path.includes(link.url) }"
        @click="linkClick(link.url)"
      >
        <span class="sidenav__label">{{ link.label }}</span>
      </li>
    </ul>
    <div
      v-if="collapsible"
      class="sidenav__close"
      @click="manageSidenav(false)"
    >
      <span>hide</span>
      <vue-feather type="chevrons-left"></vue-feather>
    </div>
  </nav>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { resizeListener } from "@/composables/utilities.js";

export default {
  name: "HTSidenav",
  props: {
    sidenavObject: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const router = useRouter();

    const collapsible = ref(false);
    const showSideNav = ref(false);

    resizeListener(() => (collapsible.value = window.innerWidth < 1100));

    const manageSidenav = (value) => {
      showSideNav.value = value;
      const body = document.querySelector("body");
      body.style.overflow = value ? "hidden" : "auto";
    };

    const linkClick = (url) => {
      if (collapsible.value) manageSidenav(false);

      router.push(url);
    };

    return {
      collapsible,
      showSideNav,
      linkClick,
      manageSidenav,
    };
  },
};
</script>
