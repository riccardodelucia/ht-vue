<template>
  <input
    :id="uuid"
    role="switch"
    :checked="checked"
    type="checkbox"
    :name="name"
    :value="currentValue"
    @change="onChange"
  />
  <label :for="uuid">{{ currentValue }}</label>
  <span v-if="errorMessage" class="ht-input-error-message">
    {{ errorMessage }}
  </span>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';

import { ref } from 'vue';

export default {
  name: 'HTToggleSwitch',
  props: {
    label: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      required: true,
    },
    valueOn: { type: [String, Boolean, Number], required: true },
    valueOff: { type: [String, Boolean, Number], required: true },
    modelValue: {
      type: [String, Boolean, Number],
      required: true,
    },
    errorMessage: {
      type: String,
      default: null,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const uuid = uuidv4();

    const checked = props.modelValue === props.valueOn;

    const currentValue = ref(checked ? props.valueOn : props.valueOff);

    const onChange = (e) => {
      currentValue.value = e.target.checked ? props.valueOn : props.valueOff;
      emit('update:modelValue', currentValue.value);
    };
    return { onChange, uuid, checked, currentValue };
  },
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
