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
  files: {
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

const emit = defineEmits(['update:files']);

const isMultiple = Array.isArray(props.files);

const onChange = (event) => {
  if (isMultiple) {
    const files = Array.from(event.target.files);
    emit('update:files', files);
  } else {
    const file = event.target.files[0];
    emit('update:files', file);
  }
};

const filename = computed(() => {
  if (Array.isArray(props.files) && props.files.length > 0) {
    return `${props.files.length} file${props.files.length > 1 ? 's' : ''}`;
  } else if (props.files?.name) {
    return props.files.name;
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
