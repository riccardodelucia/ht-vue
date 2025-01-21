<template>
  <div>
    <template v-for="(value, index) in values" :key="`radio-${index}`">
      <input
        type="radio"
        v-bind="$attrs"
        :id="`${id}-${index}`"
        :value="value"
        v-model="model"
      />
      <label :for="`${id}-${index}`">{{ labels[index] || value }}</label>
    </template>
  </div>
</template>

<script setup>
import { v4 as uuidv4 } from 'uuid';

defineProps({
  modelValue: {
    type: [Object, String, Boolean, Number],
    required: true,
  },
  values: {
    required: true,
    type: Array,
  },
  labels: {
    type: Array,
    default: () => [],
  },
  // SSR only
  id: {
    type: String,
    default: () => uuidv4(),
  },
});

const model = defineModel();
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
