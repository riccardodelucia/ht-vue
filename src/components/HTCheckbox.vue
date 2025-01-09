<template>
  <input
    :id="id"
    v-bind="$attrs"
    v-model="toggle"
    :true-value="trueValue"
    :false-value="falseValue"
    type="checkbox"
    :aria-invalid="errorMessage ? true : null"
    :aria-describedby="errorMessage ? `input-error-${id}` : null"
  />
  <label :for="id">{{ label }}</label>
  <span
    v-if="errorMessage"
    :id="`input-error-${id}`"
    class="ht-input-error-message"
    aria-live="assertive"
  >
    {{ errorMessage }}
  </span>
</template>

<script setup>
import { v4 as uuidv4 } from 'uuid';
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Object, Array, null],
    required: true,
  },
  // value is used only for multiple checkboxes
  value: {
    type: [String, Number, Boolean],
    default: null,
  },
  // trueValue is used only for single checkboxes
  trueValue: {
    type: [String, Number, Boolean, Object, Array, null],
    default: () => true,
  },
  // falseValue is used only for single checkboxes
  falseValue: {
    type: [String, Number, Boolean, Object, Array, null],
    default: () => false,
  },
  label: {
    type: String,
    default: null,
  },
  errorMessage: {
    type: String,
    default: null,
  },
  // SSR only
  id: {
    type: String,
    default: () => uuidv4(),
  },
});

const emit = defineEmits(['update:modelValue']);

const isChecked = () => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.includes(props.value);
  }
  const toggle =
    props.modelValue === props.trueValue ? props.trueValue : props.falseValue;
  return toggle;
};

const toggle = ref(isChecked());

/**
 * For details about the reason behind the use of watch, look at ht-select
 */
watch(toggle, () => {
  if (Array.isArray(props.modelValue)) {
    if (!props.modelValue.includes(props.value)) {
      emit('update:modelValue', [...props.modelValue, props.value]);
    } else {
      emit(
        'update:modelValue',
        props.modelValue.filter((value) => value !== props.value),
      );
    }
  } else emit('update:modelValue', toggle.value);
});
</script>

<style lang="postcss" scoped>
label,
input {
  vertical-align: middle;
}
label {
  margin-left: var(--size-1);
}
input:not(:first-child) {
  margin-left: var(--size-4);
}
</style>
