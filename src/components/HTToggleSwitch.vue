<template>
  <div class="input-field">
    <label v-if="label">{{ label }}</label>
    <label class="toggle">
      <div
        class="toggle__input"
        :class="{ 'toggle__input--selected': modelValue }"
      ></div>
      <input hidden type="checkbox" @click="onClick" />
      {{ option }}
    </label>
  </div>
</template>

<script>
export default {
  name: 'ToggleSwitch',
  props: {
    label: {
      type: String,
      default: '',
    },
    option: {
      type: String,
      default: '',
    },
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  methods: {
    onClick() {
      this.$emit('update:modelValue', !this.modelValue);
    },
  },
};
</script>
