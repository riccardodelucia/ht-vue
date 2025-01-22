<template>
  <label v-if="label" :for="id">{{ label }}</label>
  <textarea :id="id" v-model="model" v-bind="$attrs"></textarea>
</template>

<script setup>
import { v4 as uuidv4 } from 'uuid';
const model = defineModel({ type: [String, null], required: true });

defineProps({
  label: {
    type: String,
    default: null,
  },
  // SSR only
  id: {
    type: String,
    default: () => uuidv4(),
  },
});
</script>
