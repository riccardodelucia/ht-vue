<template>
  <template v-for="(option, idx) in options" :key="`radio-${idx}`">
    <input
      :id="radioIdArray[idx]"
      :value="option.value"
      type="radio"
      :name="name"
      :checked="modelValue === option.value"
      @change="$emit('update:model-value', option.value)"
    />
    <label :for="radioIdArray[idx]">{{ option.label }}</label>
  </template>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';

export default {
  name: 'HTRadionButtonGroup',
  props: {
    options: {
      required: true,
      type: Array,
    },
    modelValue: {
      type: [Object, String, Boolean, Number],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  emits: { 'update:model-value': null },
  setup(props) {
    const radioIdArray = [];
    for (let i = 0; i < props.options.length; i++) {
      radioIdArray.push(uuidv4());
    }
    return { radioIdArray };
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
  cursor: pointer;
}
input:not(:first-child) {
  margin-left: var(--size-4);
}
</style>
