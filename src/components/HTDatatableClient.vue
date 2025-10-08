<template>
  <ht-datatable-server
    :data="serverDatatableData"
    :columns="serverDatatableColumns"
    :row-header="rowHeader"
    :available-pages="availablePages"
    :displayable-pages="displayablePages"
    :search-all-columns-label="searchAllColumnsLabel"
    :use-search="useSearch"
    :use-multisearch="useMultisearch"
    :use-sort="useSort"
    :use-pagination="usePagination"
    :total-items-count="totalItemsCount"
    :table-cell-width="tableCellWidth"
    :table-cell-height="tableCellHeight"
    :show-sticky-column="showStickyColumn"
    v-model:page="page"
    @search-value="setSearchValue"
    @search-column="setSearchColumn"
    @search-filters="setSearchFilters"
    @sort="setSortColumn"
    @page-size="setPageSize"
  >
    <!-- This allows to forward the dynamic slots of the inner server table up to the parent -->
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot
        :name="name"
        v-bind="slotProps"
        :originalRowIndex="getOriginalRowIndex(slotProps.rowIndex)"
      />
    </template>
  </ht-datatable-server>
</template>

<script setup>
/* Note: This component is a wrapper component for HTDatatableServer.
  - It receives raw data and column definitions from the parent.
  - Applies client-side filtering, sorting, and pagination to the data.
  - Passes the processed (filtered, sorted, paginated) data and columns to <ht-datatable-server>,
    which is responsible only for rendering and emitting table events.
  - Forwards all named slots from the parent to <ht-datatable-server>,
    enabling full customization of cell rendering and row actions,
    and provides additional slot props (e.g., the original row index) to the parent. */

import { computed, ref, watch } from 'vue';

const props = defineProps({
  /* Array of column definitions ( {name, sortable, sortFn, sortDirection} ). */
  columns: { type: Array, required: true },

  /* Name of the column to use as row header (optional). */
  rowHeader: { type: String, default: null },

  /* Array of rows (each row is an array of cell values). */
  data: { type: Array, required: true },

  /* Enables the search bar for filtering rows. */
  useSearch: { type: Boolean, default: true },

  /* Enables/disables the multiple search bar for the table. */
  useMultisearch: { type: Boolean, default: false },

  /* Label for the "search all columns" option. */
  searchAllColumnsLabel: { type: String, default: 'All' },

  /* Enables sorting for sortable columns. */
  useSort: { type: Boolean, default: true },

  /* Enables pagination controls. */
  usePagination: { type: Boolean, default: true },

  /* Maximum number of page buttons to show. */
  displayablePages: {
    type: Number,
    required: false,
  },

  /* Array of column indexes to display (optional). */
  activeColumnsIndexes: { type: Array, default: null },

  /* Properties to control cell sizing. */
  tableCellWidth: { type: String, default: '100%' },
  tableCellHeight: { type: String, default: '100%' },
  stickyCellWidth: { type: String, default: '100%' },

  showStickyColumn: { type: Boolean, default: true },
});

const page = defineModel('page', { type: Number });

// ===== REACTIVE STATE =====
// Array of active multi-search filters: [{ column, value }]:
const searchFilters = ref([]);
// Current search term:
const searchValue = ref('');
// Column to search in:
const searchColumn = ref(props.searchAllColumnsLabel);
// Info about the currently sorted column:
const currentSortColumnInfo = ref(null);
//const currentPage = ref(1);
const pageSize = ref(5);

const internalActiveColumnsIndexes = computed(() => {
  if (props.activeColumnsIndexes) return props.activeColumnsIndexes;
  const allColumnsIndexes = props.columns.map((_, idx) => idx);
  return allColumnsIndexes;
});

// ===== HELPER FUNCTIONS =====
// Reset to first page when sorting or filtering changes are applied.
const resetPagination = () => {
  page.value = 1;
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

function setSearchFilters(filters) {
  // Advanced multi-search: filter on specific columns
  searchFilters.value = filters;
  resetPagination();
}

const setSortColumn = (sortColumnInfo) => {
  if (props.useSort) {
    currentSortColumnInfo.value = sortColumnInfo;
    resetPagination();
  }
};

const setPageSize = (value) => {
  if (props.usePagination) {
    pageSize.value = value;
    resetPagination();
  }
};

// Gets the row index of the selected row irrespectively of filtering, sorting and pagination.
const getOriginalRowIndex = (rowIndex) => {
  // HTDatatableServer sends back the rowIndex which indicates the current position of the row in the actual shown table.
  // since the actual shown table corresponds to the rows in paginatedData, rowIndex retrieves the corresponding row in paginated data.
  // finally, since paginatedData comes from internalTableData, which stores the initial rowIndex, we can finally retrieve the index of the origianl item in props.data
  const item = paginatedData.value[rowIndex];
  return item ? item.rowIndex : -1;
};

// ===== DATA PROCESSING PIPELINE =====

/**
 * Data processing is implemented as the following pipeline: filtering -> sorting -> pagination
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

// STEP 2: Filter rows based on search value and selected column.
const filteredTableData = computed(() => {
  let data = internalTableData.value;

  // If advanced multi-search is active
  if (props.useMultisearch && searchFilters.value.length > 0) {
    // Keep only rows that match ALL filters
    return data.filter(({ row }) =>
      searchFilters.value.every(({ column, value }) => {
        // If the filter is set to "All Columns", match if value is in ANY column
        if (column === props.searchAllColumnsLabel) {
          return row.some((cell) =>
            String(cell ?? '')
              .toLowerCase()
              .includes(value.toLowerCase()),
          );
        }
        // Otherwise, match only the specific column
        const colIdx = props.columns.findIndex((col) => col.name === column);
        if (colIdx === -1) return false;
        return String(row[colIdx] ?? '')
          .toLowerCase()
          .includes(value.toLowerCase());
      }),
    );
  }
  // If standard search is active
  else if (props.useSearch && searchValue.value) {
    const searchTerm = searchValue.value.toLowerCase();

    // Search all columns
    if (searchColumn.value === props.searchAllColumnsLabel) {
      return data.filter(({ row }) =>
        row.some(
          (elem) => String(elem).toLocaleLowerCase().indexOf(searchTerm) > -1,
        ),
      );
    }

    // Search specific column
    const colIdx = props.columns.findIndex(
      (col) => col.name === searchColumn.value,
    );
    if (colIdx === -1) {
      console.warn('Search column not found:', searchColumn.value);
      return data;
    }

    return data.filter(
      ({ row }) =>
        String(row[colIdx] || '')
          .toLocaleLowerCase()
          .indexOf(searchTerm) > -1,
    );
  }

  // No search: return all data
  return data;
});

const totalItemsCount = computed(() => filteredTableData.value.length);

// STEP 3: Sort filtered rows if sorting is enabled.
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

// STEP 4: Paginate sorted rows if pagination is enabled.
const paginatedData = computed(() => {
  if (!props.usePagination) {
    return sortedTableData.value;
  }
  return paginate(sortedTableData.value, pageSize.value, page.value);
});

// STEP 5: Extract only the active columns for display.
const serverDatatableColumns = computed(() =>
  internalActiveColumnsIndexes.value.map((index) => props.columns[index]),
);
// STEP 6: Pass the processed data and columns to HTDatatableServer.
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
