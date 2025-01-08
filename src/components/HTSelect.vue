<template>
  <label v-if="label" :for="id">{{ label }}</label>
  <select
    :id="id"
    v-model="internalModelValue"
    v-bind="$attrs"
    :multiple="isMultiple"
    :aria-invalid="errorMessage ? true : null"
    :aria-describedby="errorMessage ? `select-error-${id}` : null"
  >
    <option disabled value="">Please select one</option>
    <option
      v-for="(option, idx) in options"
      :key="`option-${idx}`"
      :value="idx"
    >
      {{ parseOptionLabel(option) }}
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

import { toRaw, watch, ref } from 'vue';

import { extractModelValueFromOption, parseOptionLabel } from '../utilities.js';

const props = defineProps({
  label: { type: String, default: null },
  modelValue: {
    type: [Object, String, Number, Array],
    required: true,
  },
  options: {
    type: Array,
    required: true,
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
const emit = defineEmits(['update:model-value']);

const compareOptionsToModelValue = (option, modelValue) => {
  if (typeof option === 'object') {
    return (
      JSON.stringify(extractModelValueFromOption(option)) ===
      JSON.stringify(toRaw(modelValue))
    );
  }
  return extractModelValueFromOption(option) === toRaw(modelValue);
};

let internalModelValue;
let isMultiple = null;

if (Array.isArray(props.modelValue)) {
  internalModelValue = ref([]);
  isMultiple = true;
} else {
  const initialOptionIdx = props.options.findIndex((option) =>
    compareOptionsToModelValue(option, props.modelValue),
  );
  internalModelValue = ref(initialOptionIdx);
}

watch(
  internalModelValue,
  () => {
    if (Array.isArray(props.modelValue)) {
      const selectedOptions = internalModelValue.value.map((idx) => {
        return extractModelValueFromOption(props.options[idx]);
      });
      emit('update:model-value', selectedOptions);
    } else {
      emit(
        'update:model-value',
        extractModelValueFromOption(props.options[internalModelValue.value]),
      );
    }
  },
  { immediate: false }, // this is to avoid a recursive initial event emission that causes an overflow of events, warned by the Vue framework in the browser console
);
</script>
