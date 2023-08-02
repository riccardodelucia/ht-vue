<template>
  <ht-button-icon
    type="button"
    :icon-type="currentTheme === 'dark' ? 'sun' : 'moon'"
    label="Switch Between Brigh /Dark Color Scheme"
    @click="onClick"
  ></ht-button-icon>
</template>

<script>
import { ref } from 'vue';

function computeInitialTheme() {
  if (import.meta.env.SSR) {
    return undefined;
  }
  if (localStorage.getItem('theme')) {
    return localStorage.getItem('theme');
  }
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

export default {
  name: 'HTThemeSwitcher',
  setup() {
    const currentTheme = ref(computeInitialTheme());
    setTheme(currentTheme.value);

    function setTheme(theme) {
      if (theme === 'light') {
        document.documentElement.classList.remove('ht-darkmode');
      } else {
        document.documentElement.classList.add('ht-darkmode');
      }
      localStorage.setItem('theme', theme);
    }

    function toggleTheme(theme) {
      if (theme === 'light') return 'dark';
      return 'light';
    }

    const onClick = () => {
      currentTheme.value = toggleTheme(currentTheme.value);
      setTheme(currentTheme.value);
    };
    return { onClick, currentTheme };
  },
};
</script>
