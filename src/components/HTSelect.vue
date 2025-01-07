<template>
  <label v-if="label" :for="id">{{ label }}</label>
  <select
    :id="id"
    :value="selectedIdx"
    v-bind="{
      ...$attrs,
      onChange,
    }"
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
    >{{ errorMessage }}</span
  >
</template>

<script setup>
import { v4 as uuidv4 } from 'uuid';

import { computed, toRaw } from 'vue';

const props = defineProps({
  label: { type: String, default: '' },
  options: {
    type: Array,
    required: true,
  },
  errorMessage: {
    type: String,
    default: null,
  },
  modelValue: {
    type: [Object, String, Number, null],
    required: true,
  },
  id: {
    type: String,
    default: () => uuidv4(),
  },
});
const emit = defineEmits(['update:model-value']);

const selectedIdx = computed(() => {
  return props.options.findIndex((option) =>
    props.valueKey
      ? option[props.valueKey] === toRaw(props.modelValue)
      : option === toRaw(props.modelValue),
  );
});

const onChange = (e) => {
  const idx = parseInt(e.target.value);
  emit('update:model-value', props.options[idx]);
};

const parseOptionLabel = (option) => {
  if (typeof option === 'object' && option?.label) return option.label;

  return option;
};
</script>
