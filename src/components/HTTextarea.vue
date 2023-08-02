<template>
  <div>
    <label :for="uuid">{{ label }}</label>
    <textarea :id="uuid" :value="modelValue" v-bind="$attrs" @input.stop="onInput"></textarea>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';

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
  },
  emits: ['update:model-value'],
  setup(_, { emit }) {
    const uuid = uuidv4();
    const onInput = (event) => emit('update:model-value', event.target.value);
    return {
      onInput,
      uuid,
    };
  },
};
</script>
