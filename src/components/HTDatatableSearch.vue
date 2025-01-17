<template>
  <div class="datatable-search">
    <ht-search-bar
      label="Search data"
      @search="(value) => (searchValue = value)"
    ></ht-search-bar>
    <div class="search-select">
      <ht-select
        v-model="searchColumn"
        :options="columnOptions"
        :showDisabledOption="false"
        label="Search By"
      ></ht-select>
    </div>
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

<style lang="postcss" scoped>
.datatable-search {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.search-select {
  display: flex;
  gap: var(--size-4);
  align-items: center;
}
</style>
