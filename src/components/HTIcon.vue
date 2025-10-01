<script setup>
/* HTIcon is a wrapper for VueFeather icons.
   Use this component to render feather icons by specifying the icon type and optional width.
   This component centralizes icon usage for the library, providing a single API.
   In the future, you can easily extend, replace, or switch the underlying icon library
   without changing how icons are used throughout your app.
*/

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
