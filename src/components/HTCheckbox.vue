<template>
  <input
    :id="uuid"
    v-bind="$attrs"
    type="checkbox"
    :checked="checked"
    @change="onChange"
  />
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
    modelValue: { type: [String, Boolean, Number], default: 'on' },
  },
  emits: { 'update:model-value': null },
  setup(props, { emit }) {
    const uuid = uuidv4();

    const checked = props.modelValue === props.value;

    const onChange = (e) => {
      emit('update:model-value', e.target.checked ? props.value : null);
    };
    return { onChange, uuid, checked };
  },
};
</script>
