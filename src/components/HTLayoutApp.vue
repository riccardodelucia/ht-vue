<template>
  <div class="app-layout">
    <header class="app-header">
      <HTButtonIcon
        id="toggle-sidenav"
        class="toggle-sidenav"
        icon-type="menu"
        type="button"
        label="Toggle Menu"
        aria-controls="sidenav"
        :aria-expanded="isExpanded"
        @click="onClick"
      >
      </HTButtonIcon>
      <slot name="header"></slot>
    </header>
    <HTSidenav
      id="sidenav"
      class="sidenav"
      aria-labelledby="toggle-sidenav"
      :aria-hidden="!isExpanded"
      :sidenav-object="sidenavObject"
    ></HTSidenav>
    <main id="main" class="main">
      <slot></slot>
    </main>
  </div>
</template>

<script>
import { ref } from 'vue';
import HTButtonIcon from '@/components/HTButtonIcon.vue';
import HTSidenav from '@/components/HTSidenav.vue';

import menuLogo from '@/assets/icons/menu-icon.svg';

export default {
  name: 'HTLayoutApp',
  components: { HTButtonIcon, HTSidenav },
  props: {
    sidenavObject: { type: Object, required: true },
    showUser: { type: Boolean, default: false },
  },

  setup() {
    const isExpanded = ref(true);

    const onClick = () => {
      isExpanded.value = !isExpanded.value;
    };

    return {
      onClick,
      isExpanded,
      menuLogo,
    };
  },
};
</script>

<style lang="postcss" scoped>
.app-layout {
  display: grid;
  min-height: 100vh;
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
  justify-content: space-between;
  align-items: center;

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

.toggle-sidenav {
  padding: 0;
  cursor: pointer;
  border: none;
  background-color: transparent;
  color: var(--ht-text-color-1);
  display: flex;
  gap: var(--size-2);
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
