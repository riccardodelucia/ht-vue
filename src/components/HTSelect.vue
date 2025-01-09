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
/**
 * Decoupling options from optionLabels has several benefits.
 * Without option labels, we should use options to show the corresponding label.
 * When options are objects, this entails the label is something not readable.
 * One first alternative would be to use as option composite objects, where we provide both a label and a value,
 * which in turns contain the real object. Proper logic could be written to show the label, and treat the
 * modelValue as the content of the 'value' property. Nevertheless, this complicates the logic
 * and exposes to misalignments between the real modelValue object and the object contain within the 'value'
 * key of the corresponding option. If objects are not the same reference, this could cause misalignments.
 * This can be ideally solved by a JSON.stringify comparison between modelValues and options 'value' properties,
 * but again complicates the logic and can become inefficient for large objects.
 *
 * By having separate labels:
 * - we ensure we have one unique source of truth for modelValue objects
 * - we prevent the user to need to assenble complex objects to both show the label and the objectModelValue
 * - we make more transparent what will be the emitted value, without further processing from the selected option
 * - we avoid JSON string comparisons, which could cause lack of performances.
 *
 */
import { v4 as uuidv4 } from 'uuid';

import { toRaw, watch, ref } from 'vue';

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
const emit = defineEmits(['update:model-value']);

let internalModelValue;
let isMultiple = null;

// Internally to the component, we use positional indexes as values for the select options
if (Array.isArray(props.modelValue)) {
  internalModelValue = ref([]);
  isMultiple = true;
} else {
  const initialOptionIdx = props.options.findIndex((option) => {
    return option === toRaw(props.modelValue);
  });
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
        return props.options[idx];
      });
      emit('update:model-value', selectedOptions);
    } else {
      emit('update:model-value', props.options[internalModelValue.value]);
    }
  },
  { immediate: false }, // this is to avoid a recursive initial event emission that causes an overflow of events, warned by the Vue framework in the browser console
);
</script>
