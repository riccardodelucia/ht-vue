<!--
  HTIcon.vue
  Vendor wrapper component for VueFeather icons.
  Use this component to render feather icons by type, optionally setting width.

  This component acts as a single point of icon usage for the library.
  In the future, you can expand the available icons by extending, replacing,
  or switching the icon library used here, without changing the API for consumers.
-->

<script setup>
import VueFeather from 'vue-feather'; 

defineProps({
  type: {
    type: String,
  },
  width: {
    type: Number,
  },
  iconClass: {
    type: [String, Array, Object],
    default: undefined,
  }
});
</script>

<template>
  <span v-if="!type" :style="{ display: 'inline-block', width: (width || 25) + 'px', height: (width || 25) + 'px' }"></span>
  <VueFeather
    v-else
    :type="type"
    :width="width"
    :class="iconClass"
  />
</template>
