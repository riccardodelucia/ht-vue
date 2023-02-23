<template>
  <a v-if="!authenticated" to="#" class="link" @click="auth.login()"
    >Sign in or Register</a
  >
  <div v-else v-click-outside="onClickOutside" tabindex="-1" class="user">
    <div v-if="!useIcon" @click="open = !open">
      {{ user }}
    </div>
    <vue-feather v-else type="user" @click="open = !open"></vue-feather>
    <div v-show="open" class="user__menu">
      <a href="#" @click="auth.logout">logout</a>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { resizeListener } from '../components/composables.js';
import { useAuth, useAuthenticated, useUserProfile } from './index.js';

export default {
  name: 'HTUser',
  setup() {
    const open = ref(false);
    const useIcon = ref(false);
    const auth = useAuth();
    const authenticated = useAuthenticated();
    const userProfile = useUserProfile();

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
