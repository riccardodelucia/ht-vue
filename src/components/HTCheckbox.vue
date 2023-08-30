<template>
  <div>
    <div>
      <input :id="uuid" :checked="modelValue" type="checkbox" @click="onClick" />
      <label :for="uuid">{{ option }}</label>
    </div>
    <small v-if="error">{{ error }}</small>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';

export default {
  name: 'HTCheckbox',
  props: {
    option: {
      type: String,
      default: '',
    },
    error: {
      type: [String, null],
      default: null,
    },
    modelValue: { type: Boolean, required: true },
  },
  emits: { 'update:modelValue': null },
  setup(props, { emit }) {
    const uuid = uuidv4();

    const onClick = () => {
      emit('update:modelValue', !props.modelValue);
    };
    return { onClick, uuid };
  },
};
</script>
