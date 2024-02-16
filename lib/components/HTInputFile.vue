<template>
  <label :for="uuid">{{ label }}</label>
  <div class="input-file-container">
    <input
      :id="uuid"
      type="file"
      v-bind="$attrs"
      :aria-invalid="errorMessage ? true : null"
      :aria-describedby="errorMessage ? `input-file-error-${uuid}` : null"
      @change="onChange"
    />
    <span class="filename">{{ fileLabel }}</span>
  </div>
  <span
    v-if="errorMessage"
    :id="`input-file-error-${uuid}`"
    class="ht-input-error-message"
    aria-live="assertive"
    >{{ errorMessage }}</span
  >
</template>

<script>
import { computed } from 'vue';
import { v4 as uuidv4 } from 'uuid';

export default {
  name: 'HTInputFile',
  props: {
    label: {
      type: String,
      default: '',
    },
    files: {
      type: [File, Array],
      default: undefined,
    },
    filenames: {
      type: [String, Array],
      default: undefined,
    },
    errorMessage: {
      type: String,
      default: null,
    },
  },
  emits: { 'update:files': null, 'update:filenames': null },
  setup(props, { emit, attrs }) {
    const uuid = uuidv4();

    const onChange = (event) => {
      if (attrs?.multiple === '') {
        const files = Array.from(event.target.files);
        emit('update:files', files);
        const filenames = files.map(({ name }) => name);
        emit('update:filenames', filenames);
      } else {
        const file = event.target.files[0];
        emit('update:files', file);
        emit('update:filenames', file.name);
      }
    };

    const fileLabel = computed(() => {
      if (Array.isArray(props.filenames))
        return props.filenames.length > 0
          ? props.filenames.length > 1
            ? `${props.filenames.length} files`
            : '1 file'
          : '';
      return props.filenames;
    });

    return { onChange, uuid, fileLabel };
  },
};
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
