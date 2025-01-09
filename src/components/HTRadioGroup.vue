<template>
  <template v-for="(option, idx) in options" :key="`radio-${idx}`">
    <input
      type="radio"
      v-bind="$attrs"
      :id="radioIdArray[idx]"
      :value="option"
      v-model="internalModelValue"
    />
    <label :for="radioIdArray[idx]">{{
      labelize(optionLabels, option, idx)
    }}</label>
  </template>
</template>

<script setup>
import { v4 as uuidv4 } from 'uuid';
import { ref, toRaw, watch } from 'vue';

import { labelize } from '../utilities.js';

/*
 * Vue manages radio groups according to a single modelValue. In addition, its particular internal management via 'value' and 'v-model' requires the same exact modelValue
 * to be used for a radio group. This means there is no possibility to split a single radio group into multiple components.
 * This would imply to use a different internal modelValue for each component, to manage the v-model. By having separate internal modelValues for every radio component,
 * Vue would not be able to associate multiple radio inputs to the same modelValue, although we are using one single modelValue from the parent component.
 */

const props = defineProps({
  modelValue: {
    type: [Object, String, Boolean, Number],
    required: true,
  },
  options: {
    required: true,
    type: Array,
  },
  optionLabels: {
    type: Array,
    default: () => [],
  },
  // SSR only
  idArray: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:model-value']);

const internalModelValue = ref(toRaw(props.modelValue));

let radioIdArray = [];
if (props.idArray.length !== props.options.length)
  for (let i = 0; i < props.options.length; i++) {
    radioIdArray.push(uuidv4());
  }
else radioIdArray = props.idArray;

watch(
  internalModelValue,
  () => {
    emit('update:model-value', internalModelValue.value);
  },
  { immediate: false },
);
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
