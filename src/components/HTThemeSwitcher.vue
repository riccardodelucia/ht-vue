<template>
  <HTButtonIcon
    type="button"
    :icon-type="theme === 'dark' ? 'sun' : 'moon'"
    label="Switch Between Bright / Dark Color Scheme"
    @click="onClick"
  />
</template>

<script setup>
import { useHTColorMode } from '../composables';
import HTButtonIcon from './HTButtonIcon.vue';

const theme = useHTColorMode()

const onClick = () => {
   theme.value = theme.value === 'light' ? 'dark' : 'light'
};
</script>