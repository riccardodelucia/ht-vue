<template>
  <input :id="uuid" v-bind="$attrs" type="checkbox" @change="onChange" />
  <label :for="uuid">{{ label }}</label>

  <span v-if="errorMessage" class="ht-input-errorMessage-message">
    {{ errorMessage }}
  </span>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';

export default {
  name: 'HTCheckbox',
  props: {
    label: { type: String, default: null },
    name: {
      type: String,
      default: null,
    },
    value: { type: [String, Boolean, Number], default: 'on' },
    errorMessage: {
      type: [String],
      default: null,
    },
  },
  emits: { 'update:model-value': null },
  setup(props, { emit }) {
    const uuid = uuidv4();

    const onChange = (e) => {
      emit('update:model-value', e.target.checked ? props.value : null);
    };
    return { onChange, uuid };
  },
};
</script>
