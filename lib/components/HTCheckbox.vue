<template>
  <input
    :id="uuid"
    v-bind="$attrs"
    type="checkbox"
    :checked="checked"
    :value="value"
    :name="name"
    :aria-invalid="errorMessage ? true : null"
    :aria-describedby="errorMessage ? `input-error-${uuid}` : null"
    @change="onChange"
  />
  <label :for="uuid">{{ label }}</label>

  <span
    v-if="errorMessage"
    :id="`input-error-${uuid}`"
    class="ht-input-error-message"
    aria-live="assertive"
  >
    {{ errorMessage }}
  </span>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';

export default {
  name: 'HTCheckbox',
  props: {
    label: { type: String, default: null },
    name: {
      type: String,
      required: true,
    },
    value: { type: [String, Boolean, Number], required: true },
    modelValue: {
      /*
       * 'value' is used to set the value of the checked checkbox, 'modelValue' is used to store either 'value' or null,
       * according to the checked state of the checkbox. Without declaring a separate value, due to modelValue's possibility of becoming null, we would loose
       * the checked checkbox value. In addition, 'modelValue' does not coincide with 'value' for multiple checkboxes, since it contains all checked values
       */
      type: [String, Boolean, Number, Array, null],
      required: true,
    },
    errorMessage: {
      type: String,
      default: null,
    },
  },
  emits: { 'update:model-value': null },
  setup(props, { emit }) {
    const uuid = uuidv4();

    const checked = props.modelValue === props.value;

    const onChange = (e) => {
      const checkboxes = document.querySelectorAll(
        `input[type='checkbox'][name='${props.name}']`,
      );
      if (checkboxes.length > 1) {
        const selections = [];
        checkboxes.forEach((checkbox) => {
          checkbox.checked && selections.push(checkbox.value);
        });
        emit('update:model-value', selections);
      } else {
        emit('update:model-value', e.target.checked ? props.value : null);
      }
    };
    return { onChange, uuid, checked };
  },
};
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
