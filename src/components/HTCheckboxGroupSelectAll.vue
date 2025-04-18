<template>
  <ht-checkbox
    ref="checkbox"
    label="De/Select All"
    :model-value="selectAll"
    @update:model-value="onCheckboxSelectAllUpdated"
  ></ht-checkbox>
</template>

<script setup>
import { ref, watchEffect } from 'vue';

const selectAll = ref(false);

const checkbox = ref(null);

const props = defineProps({
  options: {
    type: Array,
    required: true,
    validator(value) {
      // Must have at least one option
      return value.length > 0;
    },
  },
  initiallySelected: { type: Boolean, default: true },
});
const model = defineModel({ type: Array, required: true }); // array of checkbox selections

// we set the model content from within the component to be more robust against spurious initial arrays which could not contain declared options.
model.value = props.initiallySelected ? props.options : [];

const onCheckboxSelectAllUpdated = (value) => {
  model.value = value ? props.options : [];
  selectAll.value = value;
};

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
