<template>
  <div v-click-outside="onClickOutside" tabindex="-1" class="user">
    <div v-if="!useIcon" class="user__name" @click="open = !open">
      {{ user }}
      <div class="user__arrow"></div>
    </div>
    <vue-feather v-else type="user" @click="open = !open"></vue-feather>
    <div v-show="open" class="user__menu">
      <a href="#" @click="logoutUser">logout</a>
    </div>
  </div>
</template>

<script>
import { ref, computed, inject } from "vue";
import { useStore } from "vuex";
import { resizeListener } from "@/composables/utilities.js";

export default {
  name: "HTUser",
  setup() {
    const store = useStore();
    const logout = inject("logout");
    const open = ref(false);
    const useIcon = ref(false);

    resizeListener(() => (useIcon.value = window.innerWidth < 500));

    const onClickOutside = () => {
      open.value = false;
    };
    const logoutUser = () => {
      logout();
    };

    const user = computed(() => {
      const maxLength = 20;
      const name =
        store.state.user.user?.firstName ||
        store.state.user.user?.username ||
        "user";

      return name.length > maxLength
        ? name.substring(0, maxLength - 3).concat("...")
        : name;
    });

    return {
      open,
      useIcon,
      onClickOutside,
      logoutUser,
      user,
    };
  },
};
</script>
