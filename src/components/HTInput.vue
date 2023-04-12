<template>
  <div class="input-field">
    <label v-if="label" :for="uuid"> {{ label }}</label>
    <input
      :id="uuid"
      class="input"
      :class="{ 'input--error': error }"
      :value="modelValue"
      v-bind="$attrs"
      @input.stop="onInput"
    />
    <ht-input-error-message :error="error"></ht-input-error-message>
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
