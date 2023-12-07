<template>
  <label :for="uuid">{{ label }}</label>
  <input
    :id="uuid"
    :value="modelValue"
    v-bind="$attrs"
    :aria-invalid="errorMessage ? true : null"
    :aria-describedby="errorMessage ? `input-error-${uuid}` : null"
    @input="onInput"
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
      default: null,
    },
    modelValue: {
      type: [String, Number, null],
      required: true,
    },
    errorMessage: {
      type: [String],
      default: null,
    },
  },
  emits: { 'update:model-value': null },
  setup(_, { emit, attrs }) {
    const uuid = uuidv4();
    const onInput = (event) => {
      if (attrs?.type === 'number')
        emit('update:model-value', event.target.valueAsNumber);
      else emit('update:model-value', event.target.value);
    };

    return {
      onInput,
      uuid,
    };
  },
};
</script>
