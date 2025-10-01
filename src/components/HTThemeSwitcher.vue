<template>
  <ht-button-icon
    type="button"
    :icon-type="theme === 'dark' ? 'sun' : 'moon'"
    label="Switch Between Bright / Dark Color Scheme"
    @click="onClick"
  />
</template>

<script setup>
import { useHTColorTheme } from '../composables';

const theme = useHTColorTheme();

const onClick = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
};
</script>
