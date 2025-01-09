<template>
  <input
    :id="id"
    role="switch"
    v-model="toggle"
    :true-value="trueValue"
    :false-value="falseValue"
    type="checkbox"
    :aria-invalid="errorMessage ? true : null"
    :aria-describedby="errorMessage ? `input-error-${id}` : null"
  />
  <label :for="id">{{ toggle }}</label>
  <span
    v-if="errorMessage"
    :id="`input-error-${uuid}`"
    class="ht-input-error-message"
    aria-live="assertive"
    >{{ errorMessage }}
  </span>
</template>

<script setup>
import { v4 as uuidv4 } from 'uuid';
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Object, Array],
    required: true,
  },
  trueValue: {
    type: [String, Number, Boolean, Object, Array],
    default: () => true,
  },
  falseValue: {
    type: [String, Number, Boolean, Object, Array],
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
  id: {
    type: String,
    default: () => uuidv4(),
  },
});

const emit = defineEmits(['update:modelValue']);

const toggle = ref(
  props.modelValue === props.trueValue ? props.trueValue : props.falseValue,
);

/**
 * For details about the reason behind the use of watch, look at ht-select
 */
watch(
  toggle,
  () => {
    emit('update:modelValue', toggle.value);
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
}
input:not(:first-child) {
  margin-left: var(--size-4);
}
</style>
