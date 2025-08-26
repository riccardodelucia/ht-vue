<template>
  <div class="datatable">
    <ht-datatable-search
      v-if="useSearch"
      :column-options="searchableColumns"
      @search-column="onSetSearchColumn"
      @search-value="onSetSearchValue"
    ></ht-datatable-search>
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
                    >{{ row[columnIndex] }}</slot
                  >
                </div>
              </th>
              <td v-else>
                <div class="table-cell">
                  <slot
                    :column="column"
                    :columnIndex="columnIndex"
                    :rowIndex="rowIndex"
                    :dataValue="data[rowIndex][columnIndex]"
                    >{{ data[rowIndex][columnIndex] }}</slot
                  >
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
    ></ht-datatable-pagination>
  </div>
</template>

<script setup>
/**
 * Not: sorting and pagination is not done on the component to allow for more flexible logic. By emitting sort and pagination events, the parent can implement both
 * client side and server side sorting+pagination solutions
 */

import { computed, ref } from 'vue';
const props = defineProps({
  /**
   * this is the minimum set of required attributes. Any further attribute can still be passed,
   * and it will be exposed back to the parent a slot prop, to be used according to needs.
   * column_item_example = {
   *  name: String //the name to describe the column
   *  sortable: Boolean // optional, it indicates whether the column is sortable
   *  sortFn: Function // optional, it specifies a sorting logic for the column, to adapt to the column values type. Default logic is used otherwise (see sort function)
   *  sortDirection: defines the current sorting direction for the column
   * }
   *
   */
  columns: { type: Array, required: true },
  /**
   * Each row needs a table cell used as row head. This props is compared to the
   * corresponding column hnnameame for each column. When there is a correspondence, the corresponding
   * cell is set as <th>, instead of <td>.
   */
  rowHeader: { type: String, default: null },
  /**
   * Data is an array of arrays, i.e. a 2D matrix, where each matrix element is the corresponding data value for that table indexed position (i, j).
   * Empty values must therefore be provided as either null or undefined, to keep the array elements alignment in the matrix.
   * Each matrix value is exposed as a slotProp to the parent in the corresponding table cell.
   */
  data: { type: Array, required: true },
  /**
   * Enables/ disables the search bar for the table.
   */
  useSearch: { type: Boolean, default: true },
  /**
   * This sets the default option for researching values in all table columns
   */
  searchAllColumnsLabel: { type: String, default: 'All Columns' },
  /**
   * Enables/ disables the sorting for column table headers.
   */
  useSort: { type: Boolean, default: true },
  /**
   * Enables/ disables pagination for the table.
   */
  usePagination: { type: Boolean, default: true },
  /**
   * Maximum number of pages to be shown in the pagination cursor. Must be an odd value.
   */
  displayablePages: {
    type: Number,
    required: false,
  },
  /**
   * Total number of pages according to the size of data
   */
  availablePages: {
    type: Number,
    required: false,
  },
  /**
   * Total number of data rows according to the current data filtering.
   * This is shown in the pagination component.
   */
  totalItemsCount: { type: Number, default: null },
  /**
   * This defines the min width of the table cell.
   * Column width can still grow more than this number according to the size of the column header content.
   */
  tableCellWidth: { type: String, default: '30rem' },
  /**
   * When 100%, the cell height is adapted to fit the cell content.
   */
  tableCellHeight: { type: String, default: '100%' },
});

const emit = defineEmits([
  'sort',
  'page-size',
  'search-column',
  'search-value',
]);

const page = defineModel('page', { type: Number });

const sortState = ref({});

const onPageSizeChange = (pageSize) => {
  emit('page-size', pageSize);
};

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
  grid-row-gap: var(--size-5);
  width: 100%;
}

.table-container {
  max-width: 100%;
  overflow-x: scroll;
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
  overflow-y: scroll;
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
