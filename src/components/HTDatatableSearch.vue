<template>
  <div>
    <ht-search-bar label="Search data" @search="setSearchValue"></ht-search-bar>
    <ht-select
      :modelValue="searchColumn"
      :options="options"
      :optionLabels="optionLabels"
      @update:model-value="setSearchColumn"
    ></ht-select>
  </div>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue';

const props = defineProps({
  columns: { type: Array, required: true },
  // if the columns array already contains a column named 'All Columns', we give the possibility to override the all columns label
  allColumnsLabel: { type: String, default: 'All Columns' },
});

const emit = defineEmits(['search']);

const options = computed(() => {
  return ['', ...props.columns];
});

const optionLabels = computed(() => {
  return [props.allColumnsLabel, ...props.columns];
});

const searchColumn = ref(null);
const searchValue = ref('');

const setSearchValue = (value) => {
  searchValue.value = value;
};

const setSearchColumn = (value) => {
  searchColumn.value = value ? value : null;
};

watchEffect(() => {
  emit('search', {
    searchColumn: searchColumn.value,
    searchValue: searchValue.value,
  });
});
</script>

<style lang="postcss" scoped></style>
