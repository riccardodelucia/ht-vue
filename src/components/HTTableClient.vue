<template>
  <ht-table-server
    :active-column-names="activeColumnNames"
    :table-data="paginatedData"
    :columns="columns"
    :row-header="rowHeader"
    :available-pages="availablePages"
    :displayable-pages="displayablePages"
    v-model:page="currentPage"
    :use-search="useSearch"
    :use-sort="useSort"
    :use-pagination="usePagination"
    @sort="setSortColumn"
    @search="setFilterValue"
    @page-size="setPageSize"
  >
    <!-- This allows to pass the slot of the inner server table up to the parent -->
    <template v-slot="slotProps">
      <slot v-bind="slotProps"></slot>
    </template>
  </ht-table-server>
</template>

<script setup>
/**
 * Note: ht-table-client is implemented as a wrapper around ht-table-server component. It intercepts events from the ht-table-server and processes them to manage the data to be shown
 * over props.tableData
 */
import { computed, ref } from 'vue';

import Fuse from 'fuse.js';

const props = defineProps({
  columns: { type: Array, required: true }, // columns must specify the column name 'name' and optionally a sortable parameter 'sortable' and a sort function 'sortFn'
  activeColumnNames: { type: Array, required: true },
  rowHeader: { type: String, default: null },
  tableData: { type: Array, required: true },
  useSearch: { type: Boolean, default: true },
  useSort: { type: Boolean, default: true },
  usePagination: { type: Boolean, default: true },
  // max number of pages to be displayed
  displayablePages: {
    type: Number,
    required: false,
  },
});

/**
 * data processing is implemented as the following block processing: filtering -> sorting -> paginating
 * Each block is activated only if a corresponding parameter is valid (e.g. there is an active filter value).
 * Computed properties are computed on top of each previous stage.
 * This implementation, although possibly not optimized, makes the code easier to understand.
 */

///////////////////////////////////////////////
// Client side filtering
const searchFilter = ref({ searchValue: '', searchColumn: '' });

const setFilterValue = (value) => {
  if (props.useSearch) {
    searchFilter.value = value;
    resetPagination();
  }
};

const filteredTableData = computed(() => {
  const fruits = ['apple', 'orange', 'banana', 'pear'];
  const fuse = new Fuse(fruits);
  const result = fuse.search('banana');
  const { searchValue } = searchFilter.value;

  if (!searchValue || !props.useSearch) return props.tableData;
  return props.tableData.filter((row) => {
    return row[0].startsWith('S');
  });
});

///////////////////////////////////////////////
// Client-side sorting
const currentSortColumn = ref(null);

const setSortColumn = (sortColumn) => {
  if (props.useSort) currentSortColumn.value = sortColumn;
};

const sortedTableData = computed(() => {
  if (!currentSortColumn.value || !props.useSort)
    return filteredTableData.value;

  const {
    sortDirection,
    sortFn: columnSortFn,
    columnIndex,
  } = currentSortColumn.value;

  const directionMultiplier = sortDirection === 'ascending' ? 1 : -1;

  const sortFn = (a, b) => {
    // standard sorting function is: a - b
    const order = columnSortFn ? columnSortFn(a, b) : a - b;
    return order * directionMultiplier;
  };

  const sortedColumnData = filteredTableData.value
    .map((row, idx) => ({
      idx,
      value: row[columnIndex],
    }))
    .sort((a, b) => sortFn(a.value, b.value));

  return sortedColumnData.map(({ idx }) => filteredTableData.value[idx]);
});

///////////////////////////////////////////////
// Client-side pagination
const currentPage = ref(1);
const pageSize = ref(5);

const setPageSize = (value) => {
  if (props.usePagination) {
    pageSize.value = value;
    resetPagination();
  }
};

const resetPagination = () => {
  currentPage.value = 1;
};

const availablePages = computed(() => {
  if (!props.usePagination) return 0;
  return Math.ceil(sortedTableData.value.length / pageSize.value) || 1;
});

const paginatedData = computed(() => {
  if (!props.usePagination) {
    return sortedTableData.value;
  }
  return paginate(sortedTableData.value, pageSize.value, currentPage.value);
});

const paginate = (items, pageSize, currentPage) => {
  const stopIndex = Math.min(currentPage * pageSize, items.length);
  return items.slice((currentPage - 1) * pageSize, stopIndex);
};
</script>

<style lang="postcss" scoped>
.sort-button {
  background-color: transparent;
  border: 0;
  padding: 0;
  width: 100%;
  padding-right: var(--size-4);
  color: var(--ht-color-text-1);
  font-weight: var(--font-weight-8);
  position: relative;
}

.sort-button:before,
.sort-button:after {
  border: 4px solid transparent;
  content: '';
  display: block;
  height: 0;
  right: 5px;
  top: 50%;
  position: absolute;
  width: 0;
}

th[aria-sort='none'] .sort-button:before {
  border-bottom-color: var(--ht-color-gray-3);
  margin-top: -9px;
}
th[aria-sort='none'] .sort-button:after {
  border-top-color: var(--ht-color-gray-3);
  margin-top: 1px;
}

th[aria-sort='ascending'] .sort-button:before {
  border-bottom-color: var(--ht-color-gray-3);
  margin-top: -9px;
}

th[aria-sort='descending'] .sort-button:after {
  border-top-color: var(--ht-color-gray-3);
  margin-top: 1px;
}
</style>
