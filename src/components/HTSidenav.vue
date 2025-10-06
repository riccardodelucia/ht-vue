<template>
  <div class="sidenav">
    <slot name="sidenav-logo">
      <a
        class="sidenav-logo"
        href="https://humantechnopole.it/en/"
        target="_blank"
      >
        <img :src="htLogoWhite" alt="HT sidenav logo" />
      </a>
    </slot>

    <h2 id="sidenav-title">{{ title }}</h2>

    <nav aria-labelledby="sidenav-title">
      <ul v-if="links.length > 0" class="sidenav-list">
        <li v-for="(link, idx) in links" :key="idx">
          <RouterLink :to="link.to" class="sidenav-link" active-class="active">
            <ht-icon
              v-if="link.icon"
              :type="link.icon"
              :width="25"
              class="sidenav-link-icon"
            />
            <span class="sidenav-link-label">{{ link.label }}</span>
          </RouterLink>
        </li>
      </ul>
      <!-- Use this slot if you want to override the default render behavior of the sidenav -->
      <slot name="sidenav-content"></slot>
    </nav>
  </div>
</template>

<script setup>
import htLogoWhite from '../assets/ht-logo-white.svg';

defineProps({
  title: { type: String, default: 'Test' },
  links: { type: Array, default: () => [] },
});
</script>

<style scoped>
.sidenav {
  background-color: var(--ht-color-brand-blue-1);
  width: 16rem;
  min-height: 100vh;
  color: white;
  padding-block: var(--size-3);
}

:slotted(.sidenav-logo) {
  display: block;
  width: 10rem;
  padding-inline: var(--size-3);
  margin-bottom: var(--size-3);
}

h2 {
  padding-inline: var(--size-3);
  margin-bottom: var(--size-2);
  font-size: var(--font-size-3);
  font-weight: var(--font-weight-5);
}

.sidenav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidenav-link {
  display: grid;
  grid-template-columns: 32px 1fr;
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

  .sidenav-link-icon {
    grid-column: 1;
    justify-self: center;
  }

  .sidenav-link-label {
    grid-column: 2;
  }
}
</style>
