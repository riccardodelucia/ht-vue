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

/**
 * We use watch for watching an internal modelValue which follows vue implementation of select input binding.
 * The reason for watch is that it always reacts to changes to internalModelValue, ensuring events are emitted with the updated value
 * from the selection. If using a @change event on the select, although working (it does not override internal @change listener created from v-model),
 * we have no warranty it will be executed after the v-model change of the internalModelValue, possibly causing a premature event emission with the old value.
 * To overcome this, we should await for nextTick() inside the callback, which is not optimized compared to use watch, which ensueres all DOM updates from v-model and the event emission
 * are scheduled together.
 */
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
