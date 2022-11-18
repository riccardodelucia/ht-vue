<template>
  <div class="search">
    <ht-input
      v-bind="$attrs"
      type="text"
      placeholder="Search for job"
      :model-value="modelValue"
    ></ht-input>
    <div class="search__icon"><vue-feather type="search"></vue-feather></div>
  </div>
</template>

<script>
export default {
  name: "HTSearchBar",
  props: {
    modelValue: { type: [String, Number], default: undefined },
  },
  emits: ["search"],
  methods: {
    updateValue(e) {
      this.$emit("search", e.target.value);
    },
  },
};
</script>

<style lang="scss"></style>
