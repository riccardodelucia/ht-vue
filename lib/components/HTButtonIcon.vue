<template>
  <button class="ht-reset ht-grid-center-xy">
    <span class="ht-visually-hidden">{{ label }}</span>
    <VueFeather :type="iconType" :width="width"></VueFeather>
  </button>
</template>

<script>
import VueFeather from 'vue-feather';

export default {
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
};
</script>
