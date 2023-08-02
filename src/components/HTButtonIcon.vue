<template>
  <button class="ht-reset ht-grid-center-xy">
    <span class="ht-visually-hidden">{{ label }}</span>
    <vue-feather :type="iconType" :width="width"></vue-feather>
  </button>
</template>

<script>
export default {
  name: 'HTButtonIcon',
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
