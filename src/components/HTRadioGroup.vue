<template>
  <div v-for="(option, idx) in options" :key="`radio-${idx}`">
    <label>{{ option.label }}</label>
    <input
      :value="option.value"
      type="radio"
      :name="name"
      :checked="modelValue === option.value"
      @change="$emit('update:model-value', option.value)"
    />
  </div>
</template>

<script>
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
};
</script>
