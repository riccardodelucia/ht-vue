<template>
  <ht-checkbox
    ref="checkbox"
    :label="label"
    :model-value="selectAll"
    @update:model-value="onCheckboxSelectAllUpdated"
  />
</template>

<script setup>
import { ref, watchEffect } from 'vue';

const selectAll = ref(false); // Tracks the state of the "Select All" checkbox
const checkbox = ref(null); // Ref to access HTCheckbox methods (for indeterminate state)

const props = defineProps({
  options: {
    // Array of selectable values (must have at least one)
    type: Array,
    required: true,
    validator(value) {
      return value.length > 0;
    },
  },
  label: {
    // Optional text label for the "select all" checkbox
    type: String,
    default: null,
  },
});

const model = defineModel({ type: Array, required: true }); // Array of selected options

/**
 * Handler for when the "select all" checkbox is toggled.
 * - If checked, select all options.
 * - If unchecked, deselect all options.
 */
const onCheckboxSelectAllUpdated = (value) => {
  model.value = value ? props.options : [];
  selectAll.value = value;
};

/**
 * Watch for changes in the selected options array.
 * - If all options are selected, "Select All" is checked.
 * - If none are selected, "Select All" is unchecked.
 * - If some are selected, "Select All" is indeterminate (tristate).
 * Uses HTCheckbox methods via ref to set/reset indeterminate state.
 */
watchEffect(() => {
  if (model.value.length === props.options.length) {
    selectAll.value = true;
    checkbox.value?.resetIndeterminate();
  } else if (model.value.length === 0) {
    selectAll.value = false;
    checkbox.value?.resetIndeterminate();
  } else {
    selectAll.value = false;
    checkbox.value?.setIndeterminate();
  }
});
</script>
