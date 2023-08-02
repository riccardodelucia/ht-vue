<template>
  <div>
    <label v-if="label" :for="uuid">{{ label }}</label>
    <select :id="uuid" :value="optionLabel(modelValue)" v-bind="{
      ...$attrs,
      class: null, //this bypasses classes that need to be assigned to the root <div></div> tag only
      onChange,
    }" :aria-invalid="error ? true : null">
      <option disabled value="">Please select one</option>
      <option v-for="option in options" :key="option" :value="optionLabel(option)" :selected="option === modelValue">
        {{ optionLabel(option) }}
      </option>
    </select>
    <small v-if="error" class="ht-error-message">{{ error }}</small>
  </div>
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
    error: {
      type: [String, null],
      default: null,
    },
    modelValue: {
      type: [Object, String, Number, null],
      default: undefined,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const uuid = uuidv4();

    const optionLabel = (option) => {
      if (typeof option === 'object') {
        return option?.label || option;
      }
      return option;
    };

    const optionValue = (label) => {
      if (typeof props.options[0] === 'object') {
        return props.options.find((item) => item.label === label);
      }
      return label;
    };

    const onChange = (event) => {
      const value = optionValue(event.target.value);
      emit('update:modelValue', value);
    };

    return {
      optionLabel,
      onChange,
      uuid,
    };
  },
};
</script>
