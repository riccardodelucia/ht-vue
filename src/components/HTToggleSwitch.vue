<template>
  <div>
    <div>
      <input
        :id="uuid"
        role="switch"
        :checked="modelValue"
        type="checkbox"
        @click="onClick"
      />
      <label :for="uuid">{{ option }}</label>
    </div>
    <small v-if="error" class="ht-error-message">{{ error }}</small>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';

export default {
  name: 'HTToggleSwitch',
  props: {
    label: {
      type: String,
      default: '',
    },
    option: {
      type: String,
      default: '',
    },
    modelValue: {
      type: Boolean,
      required: true,
    },
    error: {
      type: [String, null],
      default: null,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const uuid = uuidv4();

    const onClick = () => {
      emit('update:modelValue', !props.modelValue);
    };
    return { onClick, uuid };
  },
};
</script>
