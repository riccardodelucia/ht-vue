<template>
  <a v-if="!auth.authenticated" to="#" class="link" @click="auth.login()"
    >Sign in or Register</a
  >
  <div v-else v-click-outside="onClickOutside" tabindex="-1" class="user">
    <div v-if="!useIcon" @click="open = !open">
      {{ userName }}
    </div>
    <vue-feather v-else type="user" @click="open = !open"></vue-feather>
    <div v-show="open" class="user__menu">
      <a href="#" @click="auth.logout()">logout</a>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { resizeListener } from '../composables.js';

export default {
  name: 'HTUser',
  props: {
    auth: {
      type: Object,
      default: () => ({
        login() {},
        logout() {},
        authenticated: false,
        user: {
          name: '',
        },
      }),
    },
  },
  setup(props) {
    const open = ref(false);
    const useIcon = ref(false);

    resizeListener(() => (useIcon.value = window.innerWidth < 500));

    const onClickOutside = () => {
      open.value = false;
    };

    const userName = computed(() => {
      const maxLength = 20;
      const name =
        props.auth.userProfile?.firstName ||
        props.auth.userProfile?.username ||
        'user';

      return name.length > maxLength
        ? name.substring(0, maxLength - 3).concat('...')
        : name;
    });

    return {
      open,
      useIcon,
      onClickOutside,
      userName,
    };
  },
};
</script>
