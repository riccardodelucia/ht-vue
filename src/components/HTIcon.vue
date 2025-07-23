<!--
  HTIcon.vue
  Vendor wrapper component for VueFeather icons.
  Use this component to render feather icons by type, optionally setting width.

  This component acts as a single point of icon usage for the library.
  In the future, you can expand the available icons by extending, replacing,
  or switching the icon library used here, without changing the API for consumers.
-->

<script setup>
import { useAttrs } from 'vue';
import VueFeather from 'vue-feather';

defineProps({
  type: {
    type: String,
  },
});
const attrs = useAttrs();
</script>

<template>
  <VueFeather v-if="type" :type="type" v-bind="attrs" />
  <span
    v-else
    v-bind="attrs"
    :style="{ display: 'inline-block', minWidth: attrs.width + 'px' }"
  />
</template>
