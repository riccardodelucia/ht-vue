<template>
  <div>
    <label :for="uuid">{{ label }}</label>
    <input
      :id="uuid"
      :value="modelValue"
      v-bind="$attrs"
      :aria-invalid="error ? true : null"
      @input.stop="onInput"
    />
    <small v-if="error">{{ error }}</small>
  </div>
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
    error: {
      type: [String, null],
      default: null,
    },
  },
  emits: { 'update:model-value': null },
  setup(_, { emit }) {
    const uuid = uuidv4();
    const onInput = (event) => {
      emit('update:model-value', event.target.value);
    };
    return {
      onInput,
      uuid,
    };
  },
};
</script>
