<template>
  <div class="datatable">
    <ht-datatable-search
      v-if="useSearch"
      :column-options="searchableColumns"
      @search-column="$emit('search-column', $event)"
      @search-value="$emit('search-value', $event)"
    ></ht-datatable-search>
    <div class="table-container">
      <table>
        <thead>
          <template
            v-for="(column, idx) in displayableColumns"
            :key="`thead-th-${idx}`"
          >
            <th scope="col" :aria-sort="column.sortDirection">
              <button
                v-if="column.sortDirection"
                class="sort-button"
                type="button"
                :aria-label="`Sort toggle for column ${column.name}`"
                @click="onSortColumn(column)"
              >
                {{ column.name }}
              </button>
              <template v-else>{{ column.name }}</template>
            </th>
          </template>
        </thead>
        <tbody>
          <!-- with this syntax, the Vue index starts from 1-->
          <tr v-for="rowIdx in nRows" :key="`tbody-row-${rowIdx}`">
            <template
              v-for="(column, columnIdx) in displayableColumns"
              :key="`tbody-column-${columnIdx}`"
            >
              <!-- register a slot for each available cell to give the parent the opportunity to specifically override that column content with
             custom HTML -->
              <th v-if="column.name === rowHeader" scope="row">
                <div class="table-cell">
                  <slot
                    :column="column"
                    :columnIndex="column.columnIndex"
                    :rowIndex="rowIdx - 1"
                    :dataValue="tableData[rowIdx - 1][column.columnIndex]"
                    >{{ tableData[rowIdx - 1][column.columnIndex] }}</slot
                  >
                </div>
              </th>
              <td v-else>
                <div class="table-cell">
                  <slot
                    :column="column"
                    :columnIndex="column.columnIndex"
                    :rowIndex="rowIdx - 1"
                    :dataValue="tableData[rowIdx - 1][column.columnIndex]"
                    >{{ tableData[rowIdx - 1][column.columnIndex] }}</slot
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
    ></ht-datatable-pagination>
  </div>
</template>

<script setup>
/**
 * Not: sorting and pagination is not done on the component to allow for more flexible logic. By emitting sort and paginate events, the parent can implement both
 * client side and server side sorting+paginating solutions
 */

import { computed, ref } from 'vue';
const props = defineProps({
  /**
   * column_item_example = {
   *  name: String //the name to describe the column
   *  sortable: Boolean // optional, it indicates whether the column is sortable
   *  sortFn: Function // optional, it specifies a sorting logic for the column, to adapt to the column values type. Default logic is used otherwise (see sort function)
   * }
   *
   */
  columns: { type: Array, required: true },
  rowHeader: { type: String, default: null },
  /**
   *  Note: tableData must provide a value for every column cell, even cells that have a custom HTML rendered slot.
   *  The corresponding value will be exposed as a slotProp to the parent.
   */
  tableData: { type: Array, required: true },
  useSearch: { type: Boolean, default: true },
  searchAllColumnsLabel: { type: String, default: 'All Columns' },
  useSort: { type: Boolean, default: true },
  usePagination: { type: Boolean, default: true },
  displayablePages: {
    type: Number,
    required: false,
  },
  availablePages: {
    type: Number,
    required: false,
  },
  tableCellWidth: { type: String, default: '30rem' }, // this defines the min width of the table cell. Column width can still grow more than this number according to the size of the column header content.
  tableCellHeight: { type: String, default: '100%' }, // when 100%, the cell height is adapted to fit the cell content.
});

const emit = defineEmits([
  'sort',
  'page-size',
  'search-column',
  'search-value',
]);

const page = defineModel('page', { type: Number });

/////////////////////////////////////////////////////
// General logic
const nRows = computed(() => props.tableData.length);

const onPageSizeChange = (pageSize) => {
  // different page sizes can mess with the sorting. Therefore, we keep the current sorting but we inform that the column is not sorted anymore.
  setCurrentSortColumn(null);
  emit('page-size', pageSize);
};

/////////////////////////////////////////////////////
// Sort columns state logic

const currentSortColumn = ref(null);

const setCurrentSortColumn = (column) => {
  if (!column || !props.useSort || !column?.sortable) {
    currentSortColumn.value = null;
    return;
  }

  let { sortDirection } = column;
  if (sortDirection === 'ascending') sortDirection = 'descending';
  else sortDirection = 'ascending';

  currentSortColumn.value = { ...column, sortDirection };
};

const onSortColumn = (column) => {
  setCurrentSortColumn(column);
  emit('sort', currentSortColumn.value);
};

/**
 * sortableColumns is crucial to make the table work proerly. It must contain the info about all original columns, not only active ones.
 * In addition, the column data must include new info compared to props.columns:
 * - the columnIndex, which is used to retrieve the corresponding table value, on each row
 * - the column sort state, according to the current selected sorting column. If the column doesn't match the current sorting column,
 * its sorting state is reset to the initial condition (either 'none' or null)
 */
const sortableColumns = computed(() => {
  if (!props.useSort) {
    // disable all sorting by putting every element's sortDirection to null
    return props.columns.map((column, idx) => {
      return {
        ...column,
        sortDirection: null,
        columnIndex: idx,
      };
    });
  } else {
    return props.columns.map((column, idx) => {
      if (column.name === currentSortColumn.value?.name) {
        return currentSortColumn.value;
      }
      return {
        ...column,
        sortDirection: column?.sortable ? 'none' : null,
        columnIndex: idx,
      };
    });
  }
});

/////////////////////////////////////////////////////
const displayableColumns = computed(() => {
  return sortableColumns.value;
});

const searchableColumns = computed(() => [
  props.searchAllColumnsLabel,
  ...displayableColumns.value.map(({ name }) => name),
]);
</script>

<style lang="postcss" scoped>
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

// putting a div within th, td allows to controls the cell height and scrolling behavior.
.table-cell {
  height: v-bind(tableCellHeight);
  overflow-y: scroll;
  white-space: pre-line; // this converts JS '\n' characters into HTML new line.
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

th[aria-sort='ascending'] .sort-button:before {
  border-bottom-color: var(--ht-color-gray-3);
  margin-top: -9px;
}

th[aria-sort='descending'] .sort-button:after {
  border-top-color: var(--ht-color-gray-3);
  margin-top: 1px;
}
</style>
