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
    <option v-if="showDisabledOption" disabled :value="null">
      {{ disabledOptionLabel }}
    </option>
    <option
      v-for="(option, index) in options"
      :key="`option-${index}`"
      :value="option"
    >
      {{ optionLabels[index] || option }}
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

const props = defineProps({
  label: { type: String, default: null },
  modelValue: {
    type: [Object, String, Number, Array],
    required: true,
  },
  showDisabledOption: { default: true },
  disabledOptionLabel: { type: String, default: 'Please select one' },
  // options refers to possible candidates values for the modelValue
  // Note: options cannot be null, which is used for the disabled option
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
  if (isMultiple.value) {
    const newSelections = props.options.filter((newOption) => {
      return props.modelValue.includes(newOption);
    });
    model.value = newSelections;
  } else if (!props.options.includes(model.value))
    if (props.showDisabledOption)
      // this is used to reset the assigned selection if options change and they don't contain the previously selected option value
      model.value = null;
    else model.value = props.options[0];
});
</script>
