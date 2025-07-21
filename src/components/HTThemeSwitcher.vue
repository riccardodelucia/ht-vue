<template>
  <HTButtonIcon
    type="button"
    :icon-type="mode === 'dark' ? 'sun' : 'moon'"
    label="Switch Between Bright / Dark Color Scheme"
    @click="onClick"
  />
</template>

<script setup>
import { useHTColorMode } from '../composables';
import HTButtonIcon from './HTButtonIcon.vue';

const mode = useHTColorMode()

const onClick = () => {
   mode.value = mode.value === 'light' ? 'dark' : 'light'
};
</script>