<template>
  <button class="ht-reset ht-grid-center-xy">
    <span class="ht-visually-hidden">{{ label }}</span>
    <HTIcon :type="iconType" :width="width" />
  </button>
</template>

<script setup>
import HTIcon from './HTIcon.vue';
defineProps({
  iconType: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  width: {
    type: Number,
    default: 25,
  },
});
</script>
