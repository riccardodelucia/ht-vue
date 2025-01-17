<template>
  <div>
    <ht-search-bar
      v-if="useSearch"
      label="Search data"
      @search="setSearchValue"
    ></ht-search-bar>
    <ht-select
      v-if="useSearch"
      v-model="searchColumn"
      :options="searchColumnsOptions"
    ></ht-select>
    <table>
      <thead>
        <template v-for="column in displayableColumns">
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
        <tr v-for="rowIndex in nRows">
          <template v-for="column in displayableColumns">
            <!-- register a slot for each available cell to give the parent the opportunity to specifically override that column content with
             custom HTML-->
            <slot
              :column="column"
              :columnIndex="column.columnIndex"
              :rowIndex="rowIndex"
              :dataValue="tableData[rowIndex - 1][column.columnIndex]"
            >
              <!-- standard content, if not overrideen by the parent -->
              <th v-if="column.name === rowHeader" role="row">
                {{ tableData[rowIndex - 1][column.columnIndex] }}
              </th>
              <td v-else>
                {{ tableData[rowIndex - 1][column.columnIndex] }}
              </td>
            </slot>
          </template>
        </tr>
      </tbody>
    </table>
    <ht-pagination
      v-if="usePagination"
      v-model:page="page"
      @page-size="onPageSizeChange"
      :available-pages="availablePages"
      :displayable-pages="displayablePages"
    ></ht-pagination>
  </div>
</template>

<script setup>
/**
 * Not: sorting and pagination is not done on the component to allow for more flexible logic. By emitting sort and paginate events, the parent can implement both
 * client side and server side sorting+paginating solutions
 */

import { computed, ref, watchEffect } from 'vue';
const props = defineProps({
  /**
   * column_item_example = {
   *  name: String //the name to describe the column
   *  sortable: Boolean // optional, it indicates whether the column is sortable
   *  sortFn: Function // optional, it specifies a sorting logic for the column, to adapt to the column values type. Default logic is used otherwise (see sort function)
   *  fixed: Boolean // optional, it enables/ disables the possibility to hide the column, irrespectively of the activeColumnNames props configuration
   * }
   *
   */
  columns: { type: Array, required: true }, // columns must specify the column name 'name' and optionally a sortable parameter 'sortable'
  activeColumnNames: { type: Array, required: true },
  rowHeader: { type: String, default: null },
  /**
   *  Note: tableData must provide a value for every column cell, even cells that have a custom HTML rendered slot.
   *  The corresponding value will be exposed as a slotProp to the parent.
   */
  tableData: { type: Array, required: true },
  useSearch: { type: Boolean, default: true },
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
});

const emit = defineEmits(['sort', 'search', 'page-size']);

// The page is linked to a model which in turns emits an'update:page' event to the parent. This allows the parent to query the specified page data on the server and sync the page back to the pagination component.
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
// Search logic
const searchColumn = ref(undefined);

const searchValue = ref('');

/**
 * Note: props.activeColumnNames doesn't enforce to include also fixed columns, that are always active. To ensure fixed columns are always made
 * available for selection in the search area, we need to compute an array that contains both active columns and fixed columns.
 * We don't use this array to compute columns to show in the template for two reason. First of all, this array should be come the input for the filtered columns.
 * Filtered columns would be computed from active columns only. Nevertheless, active columns would change for every modification of shown columns.
 * If filtered columns would be computed from the active columns, we would loose the information about the current sorting state, which would worsen the UX of the table.
 */
const searchActiveColumnNames = computed(() => {
  return props.columns
    .filter(
      (column) => props.activeColumnNames.includes(column.name) || column.fixed,
    )
    .map(({ name }) => name);
});

// Note: the hypothesist is that no column can have this column name
// TODO: implement a column name check to use another name if 'All' is already taken
const searchColumnsOptions = computed(() => [
  'All',
  ...searchActiveColumnNames.value,
]);

const setSearchValue = (value) => {
  searchValue.value = value;
};

watchEffect(() => {
  emit('search', {
    searchColumn: searchColumn.value,
    searchValue: searchValue.value,
  });
});

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
  return sortableColumns.value.filter(
    (column) => props.activeColumnNames.includes(column.name) || column.fixed,
  );
});
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
