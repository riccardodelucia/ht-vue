<template>
  <label :for="uuid">{{ label }}</label>
  <textarea
    :id="uuid"
    :value="modelValue"
    v-bind="$attrs"
    @input="$emit('update:model-value', $event.target.value)"
  ></textarea>
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
  setup() {
    const uuid = uuidv4();
    return {
      uuid,
    };
  },
};
</script>
