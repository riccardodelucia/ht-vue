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
    <option disabled :value="null">Please select one</option>
    <option
      v-for="(option, idx) in options"
      :key="`option-${idx}`"
      :value="option.value"
      :selected="option.value === modelValue"
    >
      {{ option.label }}
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
      default: undefined,
    },
  },
  emits: ['update:model-value'],
  setup(_, { emit }) {
    const uuid = uuidv4();

    const onChange = (e) => {
      emit('update:model-value', e.target.value);
    };

    return {
      uuid,
      onChange,
    };
  },
};
</script>
