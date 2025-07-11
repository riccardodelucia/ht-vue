<template>
  <HTButtonIcon
    type="button"
    :icon-type="currentTheme === 'dark' ? 'sun' : 'moon'"
    label="Switch Between Bright /Dark Color Scheme"
    @click="onClick"
  ></HTButtonIcon>
</template>

<script setup>
import { ref } from 'vue';
import HTButtonIcon from './HTButtonIcon.vue';


const emit = defineEmits(['themeChange']);

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
  return theme === 'light'? 'dark' : 'light';
}

const onClick = () => {
  currentTheme.value = toggleTheme(currentTheme.value);
  setTheme(currentTheme.value);
  emit('themeChange', currentTheme.value);
};
</script>
git