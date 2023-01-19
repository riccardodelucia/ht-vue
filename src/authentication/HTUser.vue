<template>
  <a
    v-if="!authenticated"
    to="#"
    class="header__link"
    @click="auth.login(route.fullPath)"
    >Sign in or Register</a
  >
  <div v-else v-click-outside="onClickOutside" tabindex="-1" class="user">
    <div v-if="!useIcon" class="user__name" @click="open = !open">
      {{ user }}
      <div class="user__arrow"></div>
    </div>
    <vue-feather v-else type="user" @click="open = !open"></vue-feather>
    <div v-show="open" class="user__menu">
      <a href="#" @click="auth.logout">logout</a>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { resizeListener } from '@/composables/index.js';
import { useRoute } from 'vue-router';
import { useAuth, useAuthenticated, useUserProfile } from './useAPI.js';

export default {
  name: 'HTUser',
  setup() {
    const open = ref(false);
    const useIcon = ref(false);
    const auth = useAuth();
    const authenticated = useAuthenticated();
    const userProfile = useUserProfile();
    const route = useRoute();

    resizeListener(() => (useIcon.value = window.innerWidth < 500));

    const onClickOutside = () => {
      open.value = false;
    };

    const user = computed(() => {
      const maxLength = 20;
      const name =
        userProfile.value?.firstName || userProfile.value?.username || 'user';

      return name.length > maxLength
        ? name.substring(0, maxLength - 3).concat('...')
        : name;
    });

    return {
      route,
      auth,
      open,
      useIcon,
      onClickOutside,
      authenticated,
      user,
    };
  },
};
</script>
