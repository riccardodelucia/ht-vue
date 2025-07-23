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
    default: 25,
  },
    height: {
    type: Number,
    default: 25,
  },
  iconClass: {
    type: [String, Array, Object],
    default: undefined,
  }
});
</script>

<template>
  <span
    :style="{
      display: 'inline-block',
      width: width + 'px',
      minWidth: width + 'px',
      height: height + 'px'
    }"
  >
    <VueFeather
      v-if="type"
      :type="type"
      :width="width"
      :height="height"
      :class="iconClass"
    />
  </span>
</template>
