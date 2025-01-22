<template>
  <div class="datatable-search">
    <ht-search-bar
      label="Search data"
      @search="$emit('search-value', $event)"
    ></ht-search-bar>
    <div class="search-select">
      <ht-select
        :modelValue="searchColumn"
        :options="columnOptions"
        :show-disabled-option="false"
        label="Search By"
        @update:modelValue="$emit('search-column', $event)"
      ></ht-select>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({
  columnOptions: { type: Array, required: true },
});

defineEmits(['search-column', 'search-value']);
const searchColumn = ref(props.columnOptions[0]);
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
