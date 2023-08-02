<template>
  <div>
    <span>{{ label }}</span>
    <div class="ht-radiogroup">
      <div v-for="option in options" :key="option">
        <input :id="option" type="radio" :value="option" :checked="modelValue === option"
          @click="emit('update:modelValue', option)" />
        <label :for="option">{{ option }}</label>
      </div>
    </div>
    <small v-if="error">{{ error }}</small>
  </div>
</template>

<script>
export default {
  name: 'HTRadionButtonGroup',
  props: {
    label: {
      type: String,
      default: '',
    },
    options: {
      required: true,
      type: Array,
    },
    modelValue: {
      type: String,
      default: '',
    },
    error: {
      type: [String, null],
      default: null,
    },
  },
  setup(_, { emit }) {
    return {
      emit,
    };
  },
};
</script>
