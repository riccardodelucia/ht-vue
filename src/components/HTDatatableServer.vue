<template>
  <div class="datatable">
    <ht-datatable-multisearch
      v-if="useMultisearch"
      :column-options="searchableColumns"
      @search-filters="onSetSearchFilters"
    />
    <ht-datatable-search
      v-else-if="useSearch"
      :column-options="searchableColumns"
      @search-column="onSetSearchColumn"
      @search-value="onSetSearchValue"
    />
    <div class="table-container">
      <table>
        <thead>
          <template
            v-for="(column, columnIndex) in columns"
            :key="`thead-th-${columnIndex}`"
          >
            <th scope="col" :aria-sort="setAriaSort(column, columnIndex)">
              <button
                v-if="column.sortable"
                class="sort-button"
                type="button"
                :aria-label="`Sort toggle for column ${column.name}`"
                @click="onSortColumn(column, columnIndex)"
              >
                {{ column.name }}
              </button>
              <template v-else>{{ column.name }}</template>
            </th>
          </template>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in data" :key="`tbody-row-${rowIndex}`">
            <template
              v-for="(column, columnIndex) in columns"
              :key="`tbody-column-${columnIndex}`"
            >
              <th v-if="column.name === rowHeader" scope="row">
                <div class="table-cell">
                  <slot
                    :column="column"
                    :columnIndex="columnIndex"
                    :rowIndex="rowIndex"
                    :dataValue="row[columnIndex]"
                  >
                    {{ row[columnIndex] }}
                  </slot>
                </div>
              </th>
              <td v-else>
                <div class="table-cell">
                  <slot
                    :column="column"
                    :columnIndex="columnIndex"
                    :rowIndex="rowIndex"
                    :dataValue="data[rowIndex][columnIndex]"
                  >
                    {{ data[rowIndex][columnIndex] }}
                  </slot>
                </div>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
    <ht-datatable-pagination
      v-if="usePagination"
      v-model:page="page"
      @page-size="onPageSizeChange"
      :available-pages="availablePages"
      :displayable-pages="displayablePages"
      :total-items-count="totalItemsCount"
    />
  </div>
</template>

<script setup>
/* Note: This component does not handle sorting or pagination internally. Instead, it emits events for sort and pagination actions, allowing the parent component to implement custom logic (client-side or server-side) as needed. */

import { computed, ref } from 'vue';

/* This is the minimum set of required attributes. Any additional attributes passed will be exposed to the parent as slot props, allowing for further customization and usage as needed. */
const props = defineProps({
  /* Array of column definitions for the table.
  Each column object can have:
  - name: String (column header)
  - sortable: Boolean (optional: if true, column can be sorted)
  - sortFn: Function (optional: custom sort logic for the column)
  - sortDirection: String ('ASC' or 'DESC', defines the current sort direction for the column) */
  columns: { type: Array, required: true },

  /* Name of the column to use as row header.
  The cell matching this column will be rendered as <th scope="row">, instead of <td>. */
  rowHeader: { type: String, default: null },

  /* Data should be a two-dimensional array ( 2D matrix), where each element represents the value at position (rowIndex, columnIndex) in the table.
  - Use null or undefined for empty cells to maintain correct alignment.
  - Each matrix value is exposed as a slot prop to the parent in the corresponding table cell. */
  data: { type: Array, required: true },

  /* Enables/disables the search bar for the table. */
  useSearch: { type: Boolean, default: true },

  /* Enables/disables the multiple search bar for the table. */
  useMultisearch: { type: Boolean, default: false },

  /* Label for the "search all columns" option in the search bar. */
  searchAllColumnsLabel: { type: String, default: 'All Columns' },

  /* Enables/disables the sorting for column table headers. */
  useSort: { type: Boolean, default: true },

  /* Enables/disables pagination for the table. */
  usePagination: { type: Boolean, default: true },

  /* Maximum number of pages to be shown in the pagination cursor. Must be an odd number. */
  displayablePages: {
    type: Number,
    required: false,
  },

  /* Total number of pages according to the size of data */
  availablePages: {
    type: Number,
    required: false,
  },

  /* Total number of data rows according to the current data filtering.
  This is shown in the pagination component. */
  totalItemsCount: { type: Number, default: null },

  /* Minimum width for each table cell. Cells can grow wider according to the size of the column header content. */
  tableCellWidth: { type: String, default: '30rem' },

  /* Height for each table cell. If set to '100%', cell height adapts to content. */
  tableCellHeight: { type: String, default: '100%' },
});

const emit = defineEmits([
  'sort',
  'page-size',
  'search-column',
  'search-value',
  'search-filters',
]);

const page = defineModel('page', { type: Number });

const sortState = ref({});

const onSortColumn = (column, columnIndex) => {
  const sortDirection =
    sortState.value.sortDirection === 'ASC' ? 'DESC' : 'ASC';
  sortState.value = { ...column, columnIndex, sortDirection };
  emit('sort', sortState.value);
};

const onSetSearchColumn = (column) => {
  emit('search-column', column);
};

const onSetSearchValue = (value) => {
  emit('search-value', value);
};

const onSetSearchFilters = (filters) => {
  emit('search-filters', filters); // filters = [{ column, value }, ...]
};

const onPageSizeChange = (pageSize) => {
  emit('page-size', pageSize);
};

const searchableColumns = computed(() => [
  props.searchAllColumnsLabel,
  ...props.columns.map(({ name }) => name),
]);

const setAriaSort = (column, columnIndex) => {
  if (!column.sortable) return null;
  if (columnIndex !== sortState.value.columnIndex) {
    return 'none';
  }
  return sortState.value.sortDirection;
};
</script>

<style scoped>
.datatable {
  display: grid;
  grid-row-gap: var(--size-4);
  width: 100%;
}

.table-container {
  max-width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding-block: var(--size-2);
  padding-inline: var(--size-2);
  border: 1px solid var(--ht-color-gray-3);
  min-width: v-bind(tableCellWidth);
}

th[scope='row'],
td {
  font-weight: inherit;
  text-wrap: wrap;
}

tr:nth-child(even) {
  background-color: var(--ht-surface-3);
}

/*  putting a div within th, td allows to controls the cell height and scrolling behavior. */
.table-cell {
  height: v-bind(tableCellHeight);
  overflow-y: auto;
  white-space: pre-line; /* this converts JS '\n' characters into HTML new line. */
}

.sort-button {
  background-color: transparent;
  border: 0;
  border-radius: 0;
  padding: 0;
  padding-right: 20px;
  width: 100%;
  color: var(--ht-color-text-1);
  font-weight: var(--font-weight-8);
  position: relative;
  text-wrap: nowrap;
  text-overflow: ellipsis;
  text-align: left;
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

th[aria-sort='ASC'] .sort-button:before {
  border-bottom-color: var(--ht-color-gray-3);
  margin-top: -9px;
}

th[aria-sort='DESC'] .sort-button:after {
  border-top-color: var(--ht-color-gray-3);
  margin-top: 1px;
}
</style>
