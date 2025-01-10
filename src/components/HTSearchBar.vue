<template>
  <search class="search-bar">
    <form @submit.prevent="onSubmit">
      <label :for="uuid" class="ht-visually-hidden">
        {{ label }}
      </label>
      <input
        :id="uuid"
        v-model="model"
        :placeholder="label"
        :list="listId"
        type="search"
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

<script setup>
/**
 * Note: Vue still doesn't recognise native HTML search element. This causes many warning on the console during development, which can be ignored
 */
import { v4 as uuidv4 } from 'uuid';

const props = defineProps({
  label: { type: String, required: true },
  hints: { type: Array, default: () => [] },
});

// you can either decide to constantly map search input to the parent, via optional v-model, or update the parent only after submit events, registering to the submit event
const model = defineModel({ type: [String, Number, null], required: false });

const emit = defineEmits(['submit']);

const uuid = uuidv4();
const listId = uuidv4();

const onSubmit = () => {
  emit('submit', model.value);
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
