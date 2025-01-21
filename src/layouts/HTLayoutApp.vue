<template>
  <div class="container">
    <header class="app-header">
      <ht-button-icon
        class="toggle-sidenav"
        icon-type="menu"
        type="button"
        label="Toggle Menu"
        aria-controls="sidenav"
        :aria-expanded="isExpanded"
        @click="onClick"
      >
      </ht-button-icon>
      <slot name="header"></slot>
    </header>
    <ht-sidenav
      id="sidenav"
      class="sidenav"
      :aria-hidden="!isExpanded"
      :title="sidenavTitle"
      :links="sidenavLinks"
    >
      <template #sidenav-content>
        <slot name="sidenav-content"></slot>
      </template>
    </ht-sidenav>
    <main class="main">
      <slot></slot>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  sidenavTitle: { type: String, default: '' },
  sidenavLinks: { type: Array, default: () => [] },
});

const isExpanded = ref(true);

const onClick = () => {
  isExpanded.value = !isExpanded.value;
};
</script>

<style lang="postcss" scoped>
.container {
  display: grid;
  min-height: 100vh;
  min-height: 100dvh;
  overflow: hidden;

  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    'aside header'
    'aside main';
}

.app-header {
  grid-area: header;
  padding-inline: var(--size-3);
  position: relative;
  min-height: 4rem;
  background-color: var(--surface-2);
  display: flex;
  align-items: center;

  // colored line below header
  &::after {
    content: '';
    height: var(--size-1);
    width: 100%;
    background-image: var(--ht-color-brand-gradient);
    background-size: cover;
    background-repeat: no-repeat;
    bottom: 0;
    left: 0;
    right: 0;
    position: absolute;
  }
}

.sidenav {
  grid-area: aside;
  transition: width 500ms ease-in-out;
  overflow: hidden;

  &[aria-hidden='true'] {
    width: 0;
  }
}

.main {
  grid-area: main;
}
</style>
