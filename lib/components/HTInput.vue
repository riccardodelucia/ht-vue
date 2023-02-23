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
    <div v-if="error" class="input-field__error">
      <vue-feather type="alert-circle" size="16px"></vue-feather
      ><small>{{ error }}</small>
    </div>
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
      type: String,
      default: '',
    },
  },
  emits: { 'update:modelValue': null },
  setup(_, { emit }) {
    const uuid = uuidv4();
    const onInput = (event) => {
      emit('update:modelValue', event.target.value);
    };
    return {
      onInput,
      uuid,
    };
  },
};
</script>
