<template>
  <div class="input-field">
    <label v-if="label">{{ label }}</label>
    <div class="file">
      <label class="btn btn--primary btn--sm"
        >Choose a File
        <input type="file" style="display: none" @change.stop="updateFile" />
      </label>
      <span>{{ fileName }}</span>
    </div>
    <div v-if="error" class="input-field__error">
      <vue-feather type="alert-circle" size="16px"></vue-feather
      ><small>{{ error }}</small>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'HTInputFile',
  props: {
    label: { type: String, default: '' },
    modelValue: {
      type: File,
      default: null,
    },
    error: {
      type: String,
      default: '',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  emits: { 'update:modelValue': null },
  setup(props, { emit }) {
    const updateFile = (event) => {
      emit('update:modelValue', event.target.files[0]);
    };

    const fileName = computed(() => {
      return props.modelValue?.name || '';
    });

    return { updateFile, fileName };
  },
};
</script>
