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
    :total-items-count="totalItemsCount"
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
import { computed, ref, watch } from 'vue';

const props = defineProps({
  columns: { type: Array, required: true },
  rowHeader: { type: String, default: null },
  data: { type: Array, required: true },
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
  activeColumnsIndexes: { type: Array, default: null },
});

// ===== REACTIVE STATE =====
const searchValue = ref('');
const searchColumn = ref(props.searchAllColumnsLabel);
const currentSortColumnInfo = ref(null);
const currentPage = ref(1);
const pageSize = ref(5);

const internalActiveColumnsIndexes = computed(() => {
  if (props.activeColumnsIndexes) return props.activeColumnsIndexes;
  const allColumnsIndexes = props.columns.map((_, idx) => idx);
  return allColumnsIndexes;
});

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

// gets the row index of the selected row irrespectively of filtering, sorting and pagination.
const getOriginalRowIndex = (rowIndex) => {
  // tableserver sends back the rowIndex which indicates the current position of the row in the actual shown table.
  // since the actual shown table corresponds to the rows in paginatedData, rowIndex retrieves the corresponding row in paginated data.
  // finally, since paginatedData comes from internalTableData, which stores the initial rowIndex, we can finally retrieve the index of the origianl item in props.data
  const item = paginatedData.value[rowIndex];
  return item ? item.rowIndex : -1;
};

// ===== COMPUTED PIPELINE =====

/**
 * data processing is implemented as the following pipeline: filtering -> sorting -> pagination
 * Each block is activated only if corresponding setting parameters are valid (e.g. there is a valid filter value).
 * Computed properties are computed on top of each previous stage.
 */

// STEP 1: Add original indexes to track row identity
/**
 * This is used to append the original row index value to the filtered+sorted+paginated data.
 * This information is used to inform back the parent component about the currently shown rows of data from the initial dataset,
 * which is possibly higher than the actual data rows shoen on the table (e.g. because of filtering or pagination).
 */
const internalTableData = computed(() =>
  props.data.map((row, rowIndex) => ({ row, rowIndex })),
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

const totalItemsCount = computed(() => filteredTableData.value.length);

// STEP 3: Apply sorting
const sortedTableData = computed(() => {
  if (!currentSortColumnInfo.value || !props.useSort)
    return filteredTableData.value;

  const {
    sortDirection,
    sortFn: columnSortFn,
    columnIndex,
  } = currentSortColumnInfo.value;

  const activeColumnIndex = internalActiveColumnsIndexes.value[columnIndex];

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
  internalActiveColumnsIndexes.value.map((index) => props.columns[index]),
);
// STEP: 5 Extract final data for table server component
const serverDatatableData = computed(() =>
  paginatedData.value.map(({ row }) => {
    const activeColumnsRowItems = internalActiveColumnsIndexes.value.map(
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
/**
 * Reset search and pagination when base data changes,
 * but preserve sort settings as they might still be valid
 */
watch(
  () => props.data,
  () => {
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
