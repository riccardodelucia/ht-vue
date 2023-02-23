<template>
  <div class="input-field">
    <label v-if="label">{{ label }}</label>
    <div class="file">
      <label class="btn btn--primary btn--sm"
        >Choose Files
        <input
          type="file"
          multiple
          style="display: none"
          @change.stop="updateFile"
        />
      </label>
    </div>
    <ul v-if="modelValue && modelValue.length > 0" class="file__list">
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
    <div v-if="error" class="input-field__error">
      <vue-feather type="alert-circle" size="16px"></vue-feather
      ><small>{{ error }}</small>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HTInputFileMultiple',
  props: {
    label: { type: String, default: '' },
    modelValue: {
      type: Array,
      default: null,
    },
    error: {
      type: String,
      default: '',
    },
  },
  emits: { 'update:modelValue': null },
  setup(props, { emit }) {
    const updateFile = (event) => {
      emit('update:modelValue', [...event.target.files]);
    };

    const removeFile = (selected) => {
      const files = [...props.modelValue].filter((file) => file !== selected);

      emit('update:modelValue', files.length > 0 ? files : undefined);
    };

    return { updateFile, removeFile };
  },
};
</script>
