<template>
  <form class="search-bar" @submit.prevent="onSubmit">
    <!-- https://adrianroselli.com/2015/08/where-to-put-your-search-role.html -->
    <div role="search">
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
      <HTButtonIcon type="submit" icon-type="search" label="Submit Search">
      </HTButtonIcon>
      <datalist :id="listId">
        <option
          v-for="(hint, id) in hints"
          :key="`hint-${id}`"
          :value="hint"
        ></option>
      </datalist>
    </div>
  </form>
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
      this.$emit('submit', this.value);
    },
  },
};
</script>

<style lang="postcss" scoped>
.search-bar {
  position: relative;
  display: inline-block;
  height: max-content;
  width: max-content;

  input {
    padding-right: 2.4rem;
  }

  button {
    position: absolute;
    right: 0.5rem;
    top: 0.6rem;
    color: var(--ht-color-gray-3);
  }

  input[list]::-webkit-calendar-picker-indicator {
    display: none !important;
  }
}
</style>
