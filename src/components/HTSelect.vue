<template>
  <label v-if="label" :for="id">{{ label }}</label>
  <select
    :id="id"
    v-model="model"
    v-bind="$attrs"
    :multiple="isMultiSelect"
    :aria-invalid="errorMessage ? true : null"
    :aria-describedby="errorMessage ? `select-error-${id}` : null"
  >
    <option v-if="showDisabledOption" disabled :value="null">
      {{ disabledOptionLabel }}
    </option>
    <option
      v-for="(option, idx) in options"
      :key="`option-${idx}`"
      :value="option"
    >
      {{ labelMap.get(option) }}
    </option>
  </select>
  <span
    v-if="errorMessage"
    :id="`select-error-${id}`"
    class="ht-input-error-message"
    aria-live="assertive"
    >{{ errorMessage }}
  </span>
</template>

<script setup>
import { v4 as uuidv4 } from 'uuid';
import { computed, watch } from 'vue';

const props = defineProps({
  label: {
    // Optional label for the select
    type: String,
    default: null,
  },
  showDisabledOption: {
    // Show a disabled placeholder option at the top of the options list
    default: true,
  },
  disabledOptionLabel: {
    // Text for the disabled placeholder option
    type: String,
    default: 'Please select one',
  },
  options: {
    // Array of selectable values (required)
    // Note: options cannot be null, which is reserved for the disabled option
    type: Array,
    required: true,
  },
  optionLabels: {
    // Array of labels for each option (optional)
    type: Array,
    default: () => [],
  },
  errorMessage: {
    // Optional error message to display below the select
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

// Computed that indicates if the select is a multi-select (true if model is an array)
const isMultiSelect = computed(() => {
  return Array.isArray(model.value);
});

/**
 * Build a Map to keep the association between option -> label.
 * Works with primitives or objects, and remains stable if the
 * options array is reordered.
 */
const labelMap = computed(() => {
  const map = new Map();
  props.options.forEach((opt, idx) => {
    map.set(opt, props.optionLabels[idx] || String(opt));
  });
  return map;
});

/**
 * Watch for changes in the options array.
 * - For multi-select: remove any selected values that are no longer present in the new options.
 * - For single select: if the current value is not present in the new options,
 *   - If showDisabledOption is true, reset the value to null (show placeholder).
 *   - Otherwise, set the value to the first available option.
 * This keeps the selected value(s) always in sync with the available options,
 * preventing invalid selections when the options change dynamically.
 */
watch(
  () => props.options,
  () => {
    if (isMultiSelect.value) {
      const newSelections = props.options.filter((newOption) => {
        return model.value.includes(newOption);
      });
      model.value = newSelections;
    } else if (!props.options.includes(model.value))
      if (props.showDisabledOption) model.value = null;
      else model.value = props.options[0];
  },
);
</script>
