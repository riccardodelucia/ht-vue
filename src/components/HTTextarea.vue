<template>
  <div class="input-field">
    <label v-if="label" class="input-field__label">
      {{ label }}
      <textarea
        class="textarea"
        :class="{ 'input--error': error }"
        :value="modelValue"
        v-bind="$attrs"
        @input.stop="onInput"
      >
      </textarea>
    </label>
    <ht-input-error-message :error="error"></ht-input-error-message>
  </div>
</template>

<script>
export default {
  name: 'HTTextArea',
  props: {
    label: {
      type: String,
      default: '',
    },
    modelValue: {
      type: String,
      default: '',
    },
    error: {
      type: [String, null],
      default: null,
    },
  },
  emits: ['update:model-value'],
  setup(_, { emit }) {
    const onInput = (event) => emit('update:model-value', event.target.value);
    return {
      onInput,
    };
  },
};
</script>
