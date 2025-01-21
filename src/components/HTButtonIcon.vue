<template>
  <button class="ht-reset ht-grid-center-xy">
    <span class="ht-visually-hidden">{{ label }}</span>
    <VueFeather :type="iconType" :width="width"></VueFeather>
  </button>
</template>

<script setup>
import VueFeather from 'vue-feather';

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

/* export default {
  name: 'HTButtonIcon',
  components: { VueFeather },
  props: {
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
  },
}; */
</script>
