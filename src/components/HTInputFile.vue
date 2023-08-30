<template>
  <div>
    <label :for="uuid">{{ label }}</label>
    <div class="input-file-container">
      <input
        :id="uuid"
        type="file"
        v-bind="$attrs"
        :aria-invalid="error ? true : null"
        @change.stop="updateFiles"
      />
      <span class="filename">{{ filename }}</span>
    </div>
    <small v-if="error">{{ error }}</small>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { v4 as uuidv4 } from 'uuid';

export default {
  name: 'HTInputFile',
  props: {
    label: {
      type: String,
      default: '',
    },
    modelValue: {
      type: [File, Array],
      default: undefined,
    },
    error: {
      type: [String, null],
      default: null,
    },
  },
  emits: { 'update:model-value': null },
  setup(props, { emit }) {
    const uuid = uuidv4();

    const uploadMsg = ref('');

    const updateFiles = (event) => {
      if (!event.target.hasAttribute('multiple')) {
        emit('update:model-value', event.target.files[0]);
        uploadMsg.value = event.target.files[0].name;
      } else {
        emit('update:model-value', [...event.target.files]);
        const fileLength = event.target.files.length;
        uploadMsg.value = `${fileLength} files`;
      }
    };

    const filename = computed(() => {
      if (Array.isArray(props.modelValue))
        return props.modelValue.length > 0
          ? props.modelValue.length > 1
            ? `${props.modelValue.length} files`
            : '1 file'
          : '';
      return props.modelValue?.name;
    });

    return { updateFiles, uuid, uploadMsg, filename };
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
