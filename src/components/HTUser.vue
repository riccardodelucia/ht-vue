<template>
  <a
    v-if="!auth.authenticated"
    tabindex="0"
    class="ht-reset"
    to="#"
    @click="auth.login()"
    @keyup.enter="auth.login()"
  >
    Sign in or Register
  </a>
  <div v-else v-click-outside="onClickOutside" class="user ht-grid-center-xy">
    <HTButtonIcon
      icon-type="user"
      type="button"
      label="Open User Menu"
      :aria-expanded="open"
      aria-controls="user-menu"
      @click="open = !open"
    ></HTButtonIcon>
    <div
      v-show="open"
      id="user-menu"
      class="ht-card ht-container ht-layout-stack"
      role="menu"
    >
      <h2 id="user-menu-heading">
        {{ userName }}
      </h2>
      <nav aria-labelledby="user-menu-heading">
        <a class="ht-reset logout" href="#" @click="auth.logout()">
          <VueFeather type="log-out"></VueFeather>logout
        </a>
      </nav>
    </div>
  </div>
</template>

<script>
import { ref, computed, inject } from 'vue';
import HTButtonIcon from '@/components/HTButtonIcon.vue';
import VueFeather from 'vue-feather';

export default {
  name: 'HTUser',
  components: { HTButtonIcon, VueFeather },
  setup() {
    const open = ref(false);
    const auth = inject('auth');

    const onClickOutside = () => {
      open.value = false;
    };

    const userName = computed(() => {
      const maxLength = 20;
      const name =
        auth.userProfile?.firstName || auth.userProfile?.username || 'user';

      return name.length > maxLength
        ? name.substring(0, maxLength - 3).concat('...')
        : name;
    });

    return {
      auth,
      open,
      onClickOutside,
      userName,
    };
  },
};
</script>

<style lang="postcss" scoped>
h2 {
  font-size: var(--font-size-3);
}

.user {
  position: relative;

  [role='menu'] {
    position: absolute;
    background-color: var(--ht-surface-2);
    color: var(--ht-text-color-1);

    top: 100%;
    right: 0px;
    width: max-content;

    z-index: var(--layer-1);
  }
}

.logout {
  display: flex;
  gap: var(--flex-gap, 1em);
  align-items: center;
}
</style>
