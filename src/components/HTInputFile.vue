<template>
  <div class="input-field">
    <label v-if="label">{{ label }}</label>
    <div class="file">
      <label class="btn btn--primary btn--sm"
        >{{ !multiple ? 'Select File' : 'Select Files' }}
        <input
          type="file"
          style="display: none"
          :multiple="multiple"
          @change.stop="updateFile"
        />
      </label>
      <span>{{ filename }}</span>
    </div>
    <ul v-if="multiple && modelValue.length > 0" class="file__list">
      <li v-for="(file, i) in modelValue" :key="i">
        <vue-feather
          type="x-circle"
          size="16px"
          class="file__remove"
          @click="removeFile(file)"
        >
        </vue-feather>
        <span>{{ file.name }}</span>
      </li>
    </ul>
    <ht-input-error-message :error="error"></ht-input-error-message>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'HTInputFile',
  props: {
    label: { type: String, default: '' },
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
    let updateFile, filename, removeFile, multiple;

    if (props.modelValue === undefined) {
      multiple = false;
      updateFile = (event) => {
        emit('update:model-value', event.target.files[0]);
      };

      filename = computed(() => {
        return props.modelValue?.name || '';
      });
    } else if (props.modelValue instanceof File) {
      multiple = false;
      updateFile = (event) => {
        emit('update:model-value', event.target.files[0]);
      };

      filename = computed(() => {
        return props.modelValue?.name || '';
      });
    } else {
      multiple = true;
      updateFile = (event) => {
        emit('update:model-value', [...event.target.files]);
      };

      removeFile = (selected) => {
        const files = [...props.modelValue].filter((file) => file !== selected);

        emit('update:model-value', files);
      };
    }

    return { updateFile, removeFile, filename, multiple };
  },
};
</script>
