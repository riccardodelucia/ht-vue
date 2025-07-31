<!--
  HTIcon.vue
  Vendor wrapper component for VueFeather icons.
  Use this component to render feather icons by type, optionally setting width.

  This component acts as a single point of icon usage for the library.
  In the future, you can expand the available icons by extending, replacing,
  or switching the icon library used here, without changing the API for consumers.
-->

<script setup>
import { computed } from 'vue';
import VueFeather from 'vue-feather';

const props = defineProps({
  type: {
    type: String,
  },
  width: {
    type: [String, Number],
    default: 25,
  },
});

const iconStyle = computed(() => ({
  '--icon-width':
    typeof props.width === 'number' ? props.width + 'px' : props.width,
}));
</script>

<template>
  <VueFeather v-if="type" :type="type" :width="width" v-bind="$attrs" />
  <span v-else v-bind="$attrs" class="ht-icon-placeholder" :style="iconStyle" />
</template>

<style scoped>
.ht-icon-placeholder {
  display: inline-block;
  min-width: var(--icon-width, 25px);
}
</style>
