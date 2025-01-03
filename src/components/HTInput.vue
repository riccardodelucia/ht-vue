<template>
  <label v-if="label" :for="id">{{ label }}</label>
  <input
    :id="id"
    v-model="model"
    v-bind="$attrs"
    :aria-invalid="errorMessage ? true : null"
    :aria-describedby="errorMessage ? `input-error-${id}` : null"
  />
  <span
    v-if="errorMessage"
    :id="`input-error-${id}`"
    class="ht-input-error-message"
    aria-live="assertive"
    >{{ errorMessage }}
  </span>
</template>

<script setup>
import { v4 as uuidv4 } from 'uuid';
const model = defineModel({ type: [String, Number, null], required: true });

defineProps({
  label: {
    type: String,
    default: null,
  },
  errorMessage: {
    type: String,
    default: null,
  },
  id: {
    type: String,
    default: () => uuidv4(),
  },
});
</script>
