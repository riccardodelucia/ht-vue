<template>
  <div v-for="(value, idx) in values" :key="`checkbox-${idx}`">
    <input
      :id="`${id}-${idx}`"
      v-bind="$attrs"
      v-model="model"
      :value="value"
      type="checkbox"
      :aria-invalid="errorMessage ? true : null"
      :aria-describedby="errorMessage ? `input-error-${id}` : null"
    />
    <label :for="`${id}-${idx}`">{{ labels[idx] || value }}</label>
  </div>
  <!--   <span
    v-if="errorMessage"
    :id="`input-error-${id}`"
    class="ht-input-error-message"
    aria-live="assertive"
  >
    {{ errorMessage }}
  </span> -->
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
  /*   errorMessage: {
    type: String,
    default: null,
  }, */
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
