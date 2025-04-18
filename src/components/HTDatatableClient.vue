<template>
  <ht-datatable-server
    :table-data="serverSideTableData"
    :columns="columns"
    :row-header="rowHeader"
    :available-pages="availablePages"
    :displayable-pages="displayablePages"
    v-model:page="currentPage"
    @search-value="setSearchValue"
    @search-column="setSearchColumn"
    :search-all-columns-label="searchAllColumnsLabel"
    :use-search="useSearch"
    :use-sort="useSort"
    :use-pagination="usePagination"
    :table-cell-width="tableCellWidth"
    :table-cell-height="tableCellHeight"
    @sort="setSortColumn"
    @page-size="setPageSize"
  >
    <!-- This allows to pass the slot of the inner server table up to the parent -->
    <template v-slot="slotProps">
      <slot
        v-bind="slotProps"
        :originalRowIndex="getOriginalRowIndex(slotProps.rowIndex)"
      ></slot>
    </template>
  </ht-datatable-server>
</template>

<script setup>
/**
 * Note: ht-table-client is implemented as a wrapper around ht-table-server component. It intercepts events from the ht-table-server and processes them to manage the data to be shown
 * over props.tableData
 */
import { computed, ref, watchEffect } from 'vue';

const props = defineProps({
  columns: { type: Array, required: true },
  rowHeader: { type: String, default: null },
  tableData: { type: Array, required: true },
  useSearch: { type: Boolean, default: true },
  searchAllColumnsLabel: { type: String, default: 'All' },
  useSort: { type: Boolean, default: true },
  usePagination: { type: Boolean, default: true },
  displayablePages: {
    type: Number,
    required: false,
  },
  tableCellWidth: { type: String, default: '100%' },
  tableCellHeight: { type: String, default: '100%' },
});

/**
 * Every time the shown data is updated, we emit this event to inform back the parent component.
 */
const emit = defineEmits(['shown-data']);

/**
 * data processing is implemented as the following block processing: filtering -> sorting -> paginating
 * Each block is activated only if corresponding setting parameters are valid (e.g. there is a valid filter value).
 * Computed properties are computed on top of each previous stage.
 * This implementation, although possibly not optimized, should make the code easier to understand.
 */

///////////////////////////////////////////////
// Client side filtering
const searchValue = ref('');
const searchColumn = ref(props.searchAllColumnsLabel);

const setSearchValue = (value) => {
  searchValue.value = value;
  resetPagination();
};

const setSearchColumn = (column) => {
  searchColumn.value = column;
  resetPagination();
};

/**
 * This is used to append the original row index value to the filtered+sorted+paginated data.
 * This information is used to inform back the parent component about the currently shown rows of tabelData.
 */
const internalTableData = computed(() =>
  props.tableData.map((row, idx) => ({ row, idx })),
);

const filteredTableData = computed(() => {
  if (!props.useSearch || !searchValue.value) return internalTableData.value; //props.tableData;

  if (searchColumn.value === props.searchAllColumnsLabel) {
    return internalTableData.value.filter(({ row }) =>
      row.some(
        (elem) =>
          String(elem)
            .toLocaleLowerCase()
            .indexOf(searchValue.value.toLowerCase()) > -1,
      ),
    );
  }

  const searchColumnIndex = props.columns.findIndex(
    (column) => column.name === searchColumn.value,
  );
  if (searchColumnIndex === -1)
    throw new Error('The column you are searching on cannot be found');

  return internalTableData.value.filter(
    ({ row }) =>
      String(row[searchColumnIndex])
        .toLocaleLowerCase()
        .indexOf(searchValue.value.toLowerCase()) > -1,
  );
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

  // the map creates the column array over the selected column. The index is used to then sort the corresponding columns
  const sortedColumnData = filteredTableData.value
    .map((row, currentRowIdx) => ({
      currentRowIdx,
      value: row.row[columnIndex], // remember, filteredTableData also contains the original row index of the row. Do not confuse with 'currentRowIdx'
    }))
    .sort((a, b) => sortFn(a.value, b.value));

  return sortedColumnData.map(
    ({ currentRowIdx }) => filteredTableData.value[currentRowIdx],
  );
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

///////////////////////////////////////////////
// Additional datatable client steps

watchEffect(() => {
  emit('shown-data', paginatedData.value);
});

const getOriginalRowIndex = (rowIndex) => paginatedData.value[rowIndex].idx;

///////////////////////////////////////////////
// Server-side table data
const serverSideTableData = computed(() =>
  paginatedData.value.map(({ row }) => row),
);
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
