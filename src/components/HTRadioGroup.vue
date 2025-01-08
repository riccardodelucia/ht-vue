<template>
  <template v-for="(option, idx) in options" :key="`radio-${idx}`">
    <input
      type="radio"
      :id="radioIdArray[idx]"
      :value="extractModelValueFromOption(option)"
      v-model="internalModelValue"
      @change="onChange(option)"
    />
    <label :for="radioIdArray[idx]">{{ parseOptionLabel(option) }}</label>
  </template>
</template>

<script setup>
import { v4 as uuidv4 } from 'uuid';
import { ref, toRaw, watch } from 'vue';

const props = defineProps({
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
});

const extractModelValueFromOption = (option) => {
  if (typeof option === 'object' && option?.value) return option.value;
  return option;
};

const parseOptionLabel = (option) => {
  if (typeof option === 'object' && option?.label) return option.label;
  return option;
};

const emit = defineEmits(['update:model-value']);

const internalModelValue = ref(
  extractModelValueFromOption(toRaw(props.modelValue)),
);

const radioIdArray = [];
for (let i = 0; i < props.options.length; i++) {
  radioIdArray.push(uuidv4());
}

const onChange = (option) => {
  //internalModelValue.value = extractModelValueFromOption(option);
  emit('update:model-value', extractModelValueFromOption(option));
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
