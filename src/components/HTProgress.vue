<template>
  <progress :value="value" :max="max" :aria-label="label">
    {{ value }} %
  </progress>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: '',
  },
  max: { type: Number, default: 100 },
  value: {
    type: Number,
    default: 0,
  },
});
</script>
