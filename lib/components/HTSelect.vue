<template>
  <label v-if="label" :for="uuid">{{ label }}</label>
  <select
    :id="uuid"
    v-bind="{
      ...$attrs,
      onChange,
    }"
    :aria-invalid="errorMessage ? true : null"
    :aria-describedby="errorMessage ? `select-error-${uuid}` : null"
  >
    <option disabled value="">Please select one</option>
    <option
      v-for="(option, idx) in options"
      :key="`option-${idx}`"
      :value="idx"
      :selected="option === modelValue"
    >
      {{ parseOptionValue(option) }}
    </option>
  </select>
  <span
    v-if="errorMessage"
    :id="`select-error-${uuid}`"
    class="ht-input-error-message"
    aria-live="assertive"
    >{{ errorMessage }}</span
  >
</template>

<script>
import { v4 as uuidv4 } from 'uuid';

export default {
  name: 'HTSelect',
  props: {
    label: { type: String, default: '' },
    options: {
      type: Array,
      required: true,
    },
    errorMessage: {
      type: String,
      default: null,
    },
    modelValue: {
      type: [Object, String, Number, null],
      required: true,
    },
  },
  emits: ['update:model-value'],
  setup(props, { emit }) {
    const uuid = uuidv4();

    const onChange = (e) => {
      const idx = parseInt(e.target.value);
      emit('update:model-value', props.options[idx]);
    };

    const parseOptionValue = (option) => {
      if (typeof option === 'object') {
        if (option?.label) return option.label;
        return JSON.stringify(Object.values(option)[0]);
      }
      return option;
    };

    return {
      uuid,
      onChange,
      parseOptionValue,
    };
  },
};
</script>
