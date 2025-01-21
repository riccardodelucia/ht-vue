<template>
  <div>
    <template v-for="(value, index) in values" :key="`checkbox-${index}`">
      <input
        :id="`${id}-${index}`"
        v-bind="$attrs"
        v-model="model"
        :value="value"
        type="checkbox"
        :aria-invalid="errorMessage ? true : null"
        :aria-describedby="errorMessage ? `input-error-${id}` : null"
      />
      <label :for="`${id}-${index}`">{{ labels[index] || value }}</label>
    </template>
  </div>
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

defineProps({
  values: {
    type: Array,
    default: () => [],
  },
  labels: {
    type: Array,
    default: () => [],
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

const model = defineModel();
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
