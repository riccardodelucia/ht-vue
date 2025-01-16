<template>
  <label v-if="label" :for="id">{{ label }}</label>
  <select
    :id="id"
    v-model="model"
    v-bind="$attrs"
    :multiple="isMultiple"
    :aria-invalid="errorMessage ? true : null"
    :aria-describedby="errorMessage ? `select-error-${id}` : null"
  >
    <option disabled :value="undefined">Please select one</option>
    <option
      v-for="(option, idx) in options"
      :key="`option-${idx}`"
      :value="option"
    >
      {{ labelize(optionLabels, option, idx) }}
    </option>
  </select>
  <span
    v-if="errorMessage"
    :id="`select-error-${uuid}`"
    class="ht-input-error-message"
    aria-live="assertive"
    >{{ errorMessage }}
  </span>
</template>

<script setup>
import { v4 as uuidv4 } from 'uuid';

import { computed, watch } from 'vue';

import { labelize } from '../utilities.js';

const props = defineProps({
  label: { type: String, default: null },
  modelValue: {
    type: [Object, String, Number, Array],
    required: true,
  },
  // options refers to possible candidates values for the modelValue
  options: {
    type: Array,
    required: true,
  },
  // optionLabels refers to labels to be associated to the corresponding options
  optionLabels: {
    type: Array,
    default: () => [],
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

const isMultiple = computed(() => {
  return Array.isArray(model.value);
});

// Cannot directly watch props. Therefore, we create a computed property on it.
const options = computed(() => props.options);
watch(options, () => {
  if (!props.options.includes(model.value))
    // this is used to reset the assigned selection if options change and they don't contain the previously selected option value
    model.value = undefined;
});
</script>
