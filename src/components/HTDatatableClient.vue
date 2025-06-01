<template>
  <ht-datatable-server
    :data="serverDatatableData"
    :columns="serverDatatableColumns"
    :row-header="rowHeader"
    :available-pages="availablePages"
    :displayable-pages="displayablePages"
    :search-all-columns-label="searchAllColumnsLabel"
    :use-search="useSearch"
    :use-sort="useSort"
    :use-pagination="usePagination"
    :table-cell-width="tableCellWidth"
    :table-cell-height="tableCellHeight"
    v-model:page="currentPage"
    @search-value="setSearchValue"
    @search-column="setSearchColumn"
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
import { computed, ref, watch } from 'vue';

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
  activeColumnsIndexes: { type: Array, default: () => [0, 1, 2] },
});

// ===== REACTIVE STATE =====
const searchValue = ref('');
const searchColumn = ref(props.searchAllColumnsLabel);
const currentSortColumnInfo = ref(null);
const currentPage = ref(1);
const pageSize = ref(5);

// ===== HELPER FUNCTIONS =====
const resetPagination = () => {
  currentPage.value = 1;
};

const paginate = (items, pageSize, currentPage) => {
  const stopIndex = Math.min(currentPage * pageSize, items.length);
  return items.slice((currentPage - 1) * pageSize, stopIndex);
};

// ===== EVENT HANDLERS =====
const setSearchValue = (value) => {
  searchValue.value = value;
  resetPagination();
};

const setSearchColumn = (column) => {
  searchColumn.value = column;
  resetPagination();
};

const setSortColumn = (sortColumnInfo) => {
  if (props.useSort) {
    currentSortColumnInfo.value = sortColumnInfo;
    resetPagination(); // Reset to first page when sorting changes
  }
};

const setPageSize = (value) => {
  if (props.usePagination) {
    pageSize.value = value;
    resetPagination();
  }
};

const getOriginalRowIndex = (rowIndex) => {
  const item = paginatedData.value[rowIndex];
  return item ? item.idx : -1;
};

/**
 * data processing is implemented as the following pipeline: filtering -> sorting -> paginating
 * Each block is activated only if corresponding setting parameters are valid (e.g. there is a valid filter value).
 * Computed properties are computed on top of each previous stage.
 */

// ===== COMPUTED PIPELINE =====

// STEP 1: Add original indexes to track row identity
/**
 * This is used to append the original row index value to the filtered+sorted+paginated data.
 * This information is used to inform back the parent component about the currently shown rows of tableData.
 */
const internalTableData = computed(() =>
  props.tableData.map((row, rowIndex) => ({ row, rowIndex })),
);

// STEP 2: Apply filtering
const filteredTableData = computed(() => {
  if (!props.useSearch || !searchValue.value) return internalTableData.value;

  const searchTerm = searchValue.value.toLowerCase();

  if (searchColumn.value === props.searchAllColumnsLabel) {
    return internalTableData.value.filter(({ row }) =>
      row.some(
        (elem) => String(elem).toLocaleLowerCase().indexOf(searchTerm) > -1,
      ),
    );
  }

  const searchColumnIndex = props.columns.findIndex(
    (column) => column.name === searchColumn.value,
  );
  if (searchColumnIndex === -1) {
    console.warn('Search column not found:', searchColumn.value);
    return internalTableData.value;
  }

  return internalTableData.value.filter(
    ({ row }) =>
      String(row[searchColumnIndex] || '')
        .toLocaleLowerCase()
        .indexOf(searchTerm) > -1,
  );
});

// STEP 3: Apply sorting
const sortedTableData = computed(() => {
  if (!currentSortColumnInfo.value || !props.useSort)
    return filteredTableData.value;

  const {
    sortDirection,
    sortFn: columnSortFn,
    columnIndex,
  } = currentSortColumnInfo.value;

  const activeColumnIndex = props.activeColumnsIndexes[columnIndex];

  const directionMultiplier = sortDirection === 'ASC' ? 1 : -1;

  const internalSortFn = (rowA, rowB) => {
    const a = rowA.row[activeColumnIndex];
    const b = rowB.row[activeColumnIndex];

    // Handle null/undefined values
    if (a == null && b == null) return 0;
    if (a == null) return -1;
    if (b == null) return 1;
    // standard sorting function is: a - b
    const order = columnSortFn ? columnSortFn(a, b) : a - b;
    return order * directionMultiplier;
  };

  try {
    const sortedColumnData = filteredTableData.value.toSorted((rowA, rowB) => {
      return internalSortFn(rowA, rowB);
    });
    return sortedColumnData;
  } catch (error) {
    console.error(`Cannot sort column ${activeColumnIndex}`);
    console.error(error);

    return filteredTableData.value;
  }
});

// STEP 4: Apply pagination
const paginatedData = computed(() => {
  if (!props.usePagination) {
    return sortedTableData.value;
  }
  return paginate(sortedTableData.value, pageSize.value, currentPage.value);
});

const serverDatatableColumns = computed(() =>
  props.activeColumnsIndexes.map((index) => props.columns[index]),
);
// STEP: 5 Extract final data for table server component
const serverDatatableData = computed(() =>
  paginatedData.value.map(({ row }) => {
    const activeColumnsRowItems = props.activeColumnsIndexes.map(
      (index) => row[index],
    );
    return activeColumnsRowItems;
  }),
);

const availablePages = computed(() => {
  if (!props.usePagination) return 0;
  return Math.ceil(sortedTableData.value.length / pageSize.value) || 1;
});

// ===== SIDE EFFECTS =====

watch(
  () => props.tableData,
  () => {
    // Reset search and pagination when base data changes
    // But preserve sort settings as they might still be valid
    resetPagination();

    // If current search column no longer exists, reset to "All"
    if (searchColumn.value !== props.searchAllColumnsLabel) {
      const columnExists = props.columns.some(
        (col) => col.name === searchColumn.value,
      );
      if (!columnExists) {
        searchColumn.value = props.searchAllColumnsLabel;
      }
    }
  },
  { immediate: false },
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
