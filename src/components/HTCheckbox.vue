<template>
  <div class="input-field">
    <label class="checkbox">
      <div
        class="checkbox__input"
        :class="{ 'checkbox__input--checked': modelValue }"
      ></div>
      <input hidden type="checkbox" @click="onClick" />
      {{ option }}
    </label>
  </div>
</template>

<script>
export default {
  name: 'HTCheckbox',
  props: {
    option: {
      type: String,
      default: '',
    },
    modelValue: { type: Boolean, required: true },
  },
  emits: { 'update:modelValue': null },
  setup(props, { emit }) {
    const onClick = () => {
      emit('update:modelValue', !props.modelValue);
    };
    return { onClick };
  },
};
</script>
