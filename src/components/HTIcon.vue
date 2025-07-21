<script setup>
defineProps({
  type: {
    type: String,
    required: true
  }
})
</script>

<template>
  <VueFeather :type="type" />
</template>
