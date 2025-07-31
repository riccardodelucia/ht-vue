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
    required: true,
  },
  width: {
    //in pixels
    type: [String, Number],
    default: 25,
  },
});
</script>

<template>
  <VueFeather :type="type" :width="width" v-bind="$attrs" />
</template>
