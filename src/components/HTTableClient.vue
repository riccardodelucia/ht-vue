<template>
  <ht-table-server
    :active-column-names="activeColumnNames"
    :table-data="paginatedData"
    :columns="columns"
    :row-header="rowHeader"
    :available-pages="availablePages"
    :displayable-pages="displayablePages"
    v-model:page="currentPage"
    @sort="sortData"
  >
    <!-- This allows to pass the slot of the inner server table up to the parent -->
    <template v-slot="slotProps">
      <slot v-bind="slotProps"></slot>
    </template>
  </ht-table-server>
</template>

<script setup>
/**
 * Note: ht-table-client is implemented as a wrapper on ht-server-component. It intercepts events from the ht-table-server and processes them to manage the data to be shown
 * over props.tableData
 */
import { computed, ref } from 'vue';
const props = defineProps({
  columns: { type: Array, required: true }, // columns must specify the column name 'name' and optionally a sortable parameter 'sortable' and a sort function 'sortFn'
  activeColumnNames: { type: Array, required: true },
  rowHeader: { type: String, default: null },
  tableData: { type: Array, required: true },
  // max number of pages to be displayed
  displayablePages: {
    type: Number,
    required: false,
    validator(value) {
      return value > 0 && value % 2 === 1;
    },
  },
});

///////////////////////////////////////////////
// Client-side pagination
const currentPage = ref(1);

const availablePages = computed(() => {
  if (!props.displayablePages) return 0; // this means no pagination has been activated for the component
  return Math.ceil(props.tableData.length / props.displayablePages) || 1;
});

const paginate = (items, pageSize, currentPage) => {
  const stopIndex = Math.min(currentPage * pageSize, items.length);
  return items.slice((currentPage - 1) * pageSize, stopIndex);
};

const paginatedData = computed(() => {
  if (!availablePages.value) {
    return sortedTableData.value;
  }
  return paginate(
    sortedTableData.value,
    props.displayablePages,
    currentPage.value,
  );
});

///////////////////////////////////////////////
// Client-side sorting
const sortedTableData = ref([...props.tableData]);

const sortData = ({ sortDirection, sortFn: columnSortFn, columnIndex }) => {
  const directionMultiplier = sortDirection === 'ascending' ? 1 : -1;

  const sortFn = (a, b) => {
    // standard sorting function is: a - b
    const order = columnSortFn ? columnSortFn(a, b) : a - b;
    return order * directionMultiplier;
  };

  const sortedColumnData = props.tableData
    .map((row, idx) => ({
      idx,
      value: row[columnIndex],
    }))
    .sort((a, b) => sortFn(a.value, b.value));

  sortedTableData.value = sortedColumnData.map(
    ({ idx }) => props.tableData[idx],
  );
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
