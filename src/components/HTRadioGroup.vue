<template>
  <template v-for="(option, idx) in options" :key="`radio-${idx}`">
    <input
      type="radio"
      :id="radioIdArray[idx]"
      :value="option"
      v-model="picked"
      @change="onChange"
    />
    <label :for="radioIdArray[idx]">{{ option }}</label>
  </template>
  <pre>{{ picked }}</pre>
</template>

<script setup>
import { v4 as uuidv4 } from 'uuid';
import { ref, toRaw } from 'vue';

const props = defineProps({
  options: {
    required: true,
    type: Array,
  },
  modelValue: {
    type: [Object, String, Boolean, Number],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['update:model-value']);

const picked = ref(toRaw(props.modelValue));

const radioIdArray = [];
for (let i = 0; i < props.options.length; i++) {
  radioIdArray.push(uuidv4());
}

const onChange = () => {
  console.log('onChange');
  emit('update:model-value', picked.value);
};
/* const radioIdArray = [];
for (let i = 0; i < props.options.length; i++) {
  radioIdArray.push(uuidv4());
} */

/* export default {
  name: 'HTRadionButtonGroup',
  props: {
    options: {
      required: true,
      type: Array,
    },
    modelValue: {
      type: [Object, String, Boolean, Number],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  emits: { 'update:model-value': null },
  setup(props) {
    const radioIdArray = [];
    for (let i = 0; i < props.options.length; i++) {
      radioIdArray.push(uuidv4());
    }
    return { radioIdArray };
  },
}; */
</script>

<style lang="postcss" scoped>
label,
input {
  vertical-align: middle;
}
label {
  margin-left: var(--size-1);
  cursor: pointer;
}
input:not(:first-child) {
  margin-left: var(--size-4);
}
</style>
