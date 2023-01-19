<template>
  <div class="search">
    <ht-input
      placeholder="Search..."
      type="text"
      :model-value="modelValue"
      v-bind="$attrs"
    ></ht-input>
    <div class="search__icon"><vue-feather type="search"></vue-feather></div>
  </div>
</template>

<script>
export default {
  name: 'HTSearchBar',
  inheritAttrs: false,
  props: {
    modelValue: { type: [String, Number], default: undefined },
  },
  emits: ['search'],
  methods: {
    updateValue(e) {
      this.$emit('search', e.target.value);
    },
  },
};
</script>
