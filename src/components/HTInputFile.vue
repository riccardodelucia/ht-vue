<template>
  <label :for="id">{{ label }}</label>
  <div class="input-file-container">
    <input
      :id="id"
      type="file"
      v-bind="$attrs"
      :multiple="isMultiple ? true : null"
      :aria-invalid="errorMessage ? true : null"
      :aria-describedby="errorMessage ? `input-file-error-${id}` : null"
      @change="onChange"
    />
    <span class="filename">{{ filename }}</span>
  </div>
  <span
    v-if="errorMessage"
    :id="`input-file-error-${id}`"
    class="ht-input-error-message"
    aria-live="assertive"
    >{{ errorMessage }}</span
  >
</template>

<script setup>
import { computed } from 'vue';
import { v4 as uuidv4 } from 'uuid';

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  modelValue: {
    type: [File, Array, null],
    default: undefined,
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

const isMultiple = Array.isArray(props.modelValue);

const onChange = (event) => {
  if (isMultiple) {
    const files = Array.from(event.target.files);
    emit('update:modelValue', files);
  } else {
    const file = event.target.files[0];
    emit('update:modelValue', file);
  }
};

const filename = computed(() => {
  if (Array.isArray(props.modelValue) && props.modelValue.length > 0) {
    return `${props.modelValue.length} file${props.modelValue.length > 1 ? 's' : ''}`;
  } else if (props.modelValue?.name) {
    return props.modelValue.name;
  }
  return '';
});
</script>

<style lang="postcss" scoped>
.input-file-container {
  position: relative;
  width: max-content;
}

input[type='file'] {
  color: transparent;
}

.filename {
  position: absolute;
  left: 9rem;
  top: 0.7rem;
  max-width: calc(100% - 9rem);
  max-height: 2em;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
