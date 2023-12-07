<template>
  <label :for="uuid">{{ label }}</label>
  <input
    :id="uuid"
    :value="modelValue"
    v-bind="$attrs"
    :aria-invalid="errorMessage ? true : null"
    :aria-describedby="errorMessage ? `input-error-${uuid}` : null"
    @input="$emit('update:model-value', $event.target.value)"
  />
  <span
    v-if="errorMessage"
    class="ht-input-error-message"
    aria-live="assertive"
    >{{ errorMessage }}</span
  >
</template>

<script>
import { v4 as uuidv4 } from 'uuid';

export default {
  name: 'HTInput',
  props: {
    label: {
      type: String,
      default: '',
    },
    modelValue: {
      type: [String, Number],
      default: '',
    },
    errorMessage: {
      type: [String],
      default: null,
    },
  },
  emits: { 'update:model-value': null },
  setup() {
    const uuid = uuidv4();

    return {
      uuid,
    };
  },
};
</script>
