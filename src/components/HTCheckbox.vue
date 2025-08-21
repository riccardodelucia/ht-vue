<template>
  <input
    ref="checkbox"
    :id="id"
    v-bind="$attrs"
    v-model="model"
    :true-value="trueValue"
    :false-value="falseValue"
    :value="value"
    type="checkbox"
    :aria-invalid="errorMessage ? true : null"
    :aria-describedby="errorMessage ? `input-error-${id}` : null"
  />
  <label :for="id">{{ label }}</label>
  <span
    v-if="errorMessage"
    :id="`input-error-${id}`"
    class="ht-input-error-message"
    aria-live="assertive"
  >
    {{ errorMessage }}
  </span>
</template>

<script setup>
import { v4 as uuidv4 } from 'uuid';
import { ref } from 'vue';

defineProps({
  trueValue: {
    type: [String, Number, Boolean, Object, Array, null],
    default: () => true,
  },
  falseValue: {
    type: [String, Number, Boolean, Object, Array, null],
    default: () => false,
  },
  value: { type: [String, Number, Boolean, Object], required: false }, // for multiple checkboxes only
  label: {
    type: String,
    default: null,
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
const checkbox = ref(null);

const setIndeterminate = () => {
  checkbox.value.indeterminate = true;
};
const resetIndeterminate = () => {
  checkbox.value.indeterminate = false;
};

defineExpose({
  setIndeterminate,
  resetIndeterminate,
});
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
