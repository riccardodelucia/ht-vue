<template>
  <input
    :id="id"
    v-bind="$attrs"
    :checked="isChecked(modelValue, value)"
    type="checkbox"
    :aria-invalid="errorMessage ? true : null"
    :aria-describedby="errorMessage ? `input-error-${id}` : null"
    @change="onChange"
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

const props = defineProps({
  modelValue: {
    type: [Boolean, Array],
    required: true,
  },
  value: {
    type: [String, Number, Boolean],
    default: null,
  },
  label: {
    type: String,
    default: null,
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

const emit = defineEmits(['update:modelValue']);

const isChecked = (modelValue, value) => {
  if (Array.isArray(modelValue)) {
    return modelValue.includes(value);
  }
  return modelValue;
};

const onChange = (event) => {
  if (Array.isArray(props.modelValue)) {
    const checked = event.target.checked;
    if (checked) {
      emit('update:modelValue', [...props.modelValue, props.value]);
    } else {
      emit(
        'update:modelValue',
        props.modelValue.filter((value) => value !== props.value),
      );
    }
  } else emit('update:modelValue', event.target.checked);
};
</script>

<style lang="postcss" scoped>
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
