<template>
  <search class="search-bar">
    <!-- https://adrianroselli.com/2015/08/where-to-put-your-search-role.html -->
    <form @submit.prevent="onSubmit">
      <label :for="uuid" class="ht-visually-hidden">
        {{ label }}
      </label>
      <input
        :id="uuid"
        :value="modelValue"
        :placeholder="label"
        :list="listId"
        type="search"
        @input="onInput"
      />
      <button type="submit" icon-type="search" label="Submit Search">
        <VueFeather type="search" width="5"></VueFeather>
      </button>
      <datalist :id="listId">
        <option
          v-for="(hint, id) in hints"
          :key="`hint-${id}`"
          :value="hint"
        ></option>
      </datalist>
    </form>
  </search>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import HTButtonIcon from './HTButtonIcon.vue';

export default {
  name: 'HTSearchBar',
  components: { HTButtonIcon },
  props: {
    label: { type: String, required: true },
    modelValue: { type: [String, Number], default: undefined },
    hints: { type: Array, default: () => [] },
  },
  emits: ['update:model-value', 'submit'],
  data() {
    const uuid = uuidv4();
    const listId = uuidv4();
    const value = this.modelValue;
    return { uuid, value, listId };
  },
  methods: {
    onInput(e) {
      this.value = e.target.value;
      this.$emit('update:model-value', e.target.value);
    },
    onSubmit() {
      console.log('submitted');
      this.$emit('submit', this.value);
    },
  },
};
</script>

<style lang="postcss" scoped>
/**
  Note: currently, there no way to style a datalist with pure CSS. The approach to style it requires a bunch of work with JS, which here is omitted for simplicity
*/
.search-bar {
  display: inline-block;
}

.search-bar form {
  display: flex;
  flex-wrap: nowrap;
}

input {
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
}

input[list]::-webkit-calendar-picker-indicator {
  display: none !important;
}

input[type='search']::-webkit-search-decoration,
input[type='search']::-webkit-search-cancel-button,
input[type='search']::-webkit-search-results-button,
input[type='search']::-webkit-search-results-decoration {
  display: none;
}

button {
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  width: 4rem;
}
</style>
