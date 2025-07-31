<template>
  <input
    :id="id"
    role="switch"
    v-model="model"
    :true-value="trueValue"
    :false-value="falseValue"
    v-bind="$attrs"
    type="checkbox"
    :aria-invalid="errorMessage ? true : null"
    :aria-describedby="errorMessage ? `input-error-${id}` : null"
  />
  <label :for="id">{{ model }}</label>
  <span
    v-if="errorMessage"
    :id="`input-error-${uuid}`"
    class="ht-input-error-message"
    aria-live="assertive"
    >{{ errorMessage }}
  </span>
</template>

<script setup>
import { v4 as uuidv4 } from 'uuid';

defineProps({
  trueValue: {
    type: [String, Number, Boolean, Object, Array, null],
    default: () => true,
  },
  falseValue: {
    type: [String, Number, Boolean, Object, Array, null],
    default: () => false,
  },
  errorMessage: {
    type: String,
    default: null,
  },
  // SSR only
  id: {
    type: String,
    default: () => uuidv4(),
  },
});
const model = defineModel();
</script>

<style scoped>
label,
input {
  vertical-align: middle;
}
label {
  margin-left: var(--size-1);
}
input:not(:first-child) {
  margin-left: var(--size-4);
}
</style>
