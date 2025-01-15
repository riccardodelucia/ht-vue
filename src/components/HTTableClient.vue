<template>
  <ht-table-server
    :active-column-names="activeColumnNames"
    :table-data="tableData"
    :columns="columns"
    row-header="Italy"
    :available-pages="availablePages"
    :displayable-pages="displayablePages"
    v-model:page="currentPage"
    @sort="
      (column) => {
        console.log('sorting');
        console.log(column);
      }
    "
  >
    <!-- This allows to pass the slot of the inner server table up to the parent -->
    <template v-slot="slotProps">
      <slot v-bind="slotProps"></slot>
    </template>
  </ht-table-server>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
const props = defineProps({
  columns: { type: Array, required: true }, // columns must specify the column name 'name' and optionally a sortable parameter 'sortable' and a sort function 'sortFn'
  activeColumnNames: { type: Array, required: true },
  rowHeader: { type: String, default: null },
  tableData: { type: Array, required: true },
  // max number of pages to be displayed
  displayablePages: {
    type: Number,
    default: 5,
    validator(value) {
      return value > 0 && value % 2 === 1;
    },
  },
  // total number of pages according to the size of data
  availablePages: {
    type: Number,
    default: 0,
    validator(value) {
      return value >= 0;
    },
  },
});

const currentPage = ref(1);
watch(currentPage, () => {
  console.log(currentPage.value);
});
/**
 * Not: sorting and pagination is not done on the component to allow for more flexible logic. By emitting sort and paginate events, the parent can implement both
 * client side and server side sorting+paginating solutions
 */
// const emit = defineEmits(['sort']);

/////////////////////////////////////////////////////
// General logic
/* const nRows = computed(() => props.tableData.length);
const nColumns = computed(() => props.tableData[0].length);

const columnNames = computed(() => props.columns.map(({ name }) => name));

const rowHeaderIndex = computed(() => {
  // it computes the cell index of the column which acts as the name for every row
  if (props.rowHeader) {
    return columnNames.value.indexOf(props.rowHeader);
  }
  return -1;
}); */

// used to compute if the current cell must be shown or not.
//const isColumnActive = (name) => props.activeColumnNames.includes(name);

/////////////////////////////////////////////////////
// Sorting logic

/* const sortableColumns = ref(null);
const sortedData = ref(null);

watchEffect(() => {
  sortableColumns.value = props.columns.map((column) => {
    return {
      ...column,
      sortDirection: column?.sortable ? 'none' : null,
    };
  });
});
watchEffect(() => {
  sortedData.value = props.tableData.map((row) => row);
});

const updateSortableColumns = (sortingColumn, columns) => {
  return columns.map((column) => {
    let sortDirection = null;
    if (column.name === sortingColumn.name) {
      if (sortingColumn.sortDirection === 'ascending')
        sortDirection = 'descending';
      else sortDirection = 'ascending';
    } else {
      sortDirection = column?.sortable ? 'none' : null;
    }
    return { ...column, sortDirection };
  });
};

const onSortColumn = (sortingColumn) => {
  sortableColumns.value = updateSortableColumns(sortingColumn, props.columns);

  const columnIndex = sortableColumns.value
    .map(({ name }) => name)
    .indexOf(sortingColumn.name);

  if (!props.server) {
    // client side sorting
    const { sortDirection, sortFn } = sortableColumns.value[columnIndex];
    sortedData.value = sortData(
      props.tableData,
      columnIndex,
      sortDirection,
      sortFn,
    );
  } else emit('sort', { ...sortingColumn, columnIndex });
};

const sortData = (
  tableData,
  columnIndex,
  sortDirection,
  columnSortFn = (a, b) => a - b,
) => {
  const directionMultiplier = sortDirection === 'ascending' ? 1 : -1;

  const sortFn = (a, b) => {
    const order = columnSortFn(a, b);
    return order * directionMultiplier;
  };

  const sortedColumnData = tableData
    .map((row, idx) => ({
      idx,
      value: row[columnIndex],
    }))
    .sort((a, b) => sortFn(a.value, b.value));

  return sortedColumnData.map(({ idx }) => tableData[idx]);
}; */
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
