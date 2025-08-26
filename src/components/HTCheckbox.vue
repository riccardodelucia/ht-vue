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
    // Custom value returned when checked.
    type: [String, Number, Boolean, Object, Array, null],
    default: () => true,
  },
  falseValue: {
    // Custom value returned when unchecked.
    type: [String, Number, Boolean, Object, Array, null],
    default: () => false,
  },
  value: {
    // Only used for checkbox groups: the value for this checkbox in a group
    type: [String, Number, Boolean, Object],
    required: false,
  },
  label: {
    // Optional text label for the checkbox
    type: String,
    default: null,
  },
  errorMessage: {
    // Optional error message shown below the checkbox
    type: String,
    default: null,
  },
  id: {
    // Unique id used for input/label association in SSR scenario; generated if not provided
    type: String,
    default: () => uuidv4(),
  },
});

const model = defineModel();
const checkbox = ref(null);

// Exposed methods to set/reset indeterminate state (useful for tri-state checkboxes)
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
