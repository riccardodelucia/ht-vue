<template>
  <div>
    <ht-search-bar
      label="Search data"
      @search="(value) => (searchValue = value)"
    ></ht-search-bar>
    <ht-select
      v-model="searchColumn"
      :options="columnOptions"
      :showDisabledOption="false"
    ></ht-select>
  </div>
</template>

<script setup>
const props = defineProps({
  columnOptions: { type: Array, required: true },
  // if the columns array already contains a column named 'All Columns', we give the possibility to override the all columns label
});

const searchValue = defineModel('search-value');
const searchColumn = defineModel('search-column');
</script>

<style lang="postcss" scoped></style>
