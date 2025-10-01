<template>
  <button class="ht-reset ht-grid-center-xy" v-bind="$attrs">
    <span class="ht-visually-hidden">{{ label }}</span>
    <ht-icon :type="iconType" :width="width" />
  </button>
</template>

<script setup>
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
