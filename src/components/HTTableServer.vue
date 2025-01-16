<template>
  <div>
    {{ searchColumn }}
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
        <template v-for="(column, idx) in sortableColumns">
          <th
            v-if="isColumnActive(column)"
            scope="col"
            :aria-sort="column.sortDirection"
          >
            <button
              v-if="column.sortDirection"
              class="sort-button"
              type="button"
              :aria-label="`Sort toggle for column ${column.name}`"
              @click="onSortColumn(column, idx)"
            >
              {{ column.name }}
            </button>
            <template v-else>{{ column.name }}</template>
          </th>
        </template>
      </thead>
      <tbody>
        <tr v-for="rowIndex in nRows">
          <template v-for="(column, columnIndex) in columns">
            <template v-if="isColumnActive(column)">
              <!-- register a slot for each available cell to give the parent the opportunity to specifically override that column content with
             custom HTML-->
              <slot
                :column="column"
                :columnIndex="columnIndex"
                :rowIndex="rowIndex"
                :dataValue="tableData[rowIndex - 1][columnIndex]"
              >
                <!-- standard content, if not overrideen by the parent -->
                <th v-if="columnIndex === rowHeaderIndex" role="row">
                  {{ tableData[rowIndex - 1][columnIndex] }}
                </th>
                <td v-else>
                  {{ tableData[rowIndex - 1][columnIndex] }}
                </td>
              </slot>
            </template>
          </template>
        </tr>
      </tbody>
    </table>
    <ht-pagination
      v-if="usePagination"
      v-model:page="page"
      @page-size="emit('page-size', $event)"
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

const rowHeaderIndex = computed(() => {
  // it computes the cell index of the column which acts as the name for every row
  if (props.rowHeader) {
    return props.columns.map(({ name }) => name).indexOf(props.rowHeader);
  }
  return -1;
});

// used to compute if the current column must be shown or not.
const isColumnActive = (column) => {
  if (column?.fixed) return true;
  return props.activeColumnNames.includes(column.name);
};

const searchColumn = ref(undefined);

const searchValue = ref('');

const searchColumnsOptions = computed(() => [
  'All',
  ...props.activeColumnNames,
]);

const setSearchValue = (value) => {
  debugger;
  searchValue.value = value;
};

watchEffect(() => {
  console.log('change!');
  emit('search', {
    searchColumn: searchColumn.value,
    searchValue: searchValue.value,
  });
});

/////////////////////////////////////////////////////
// Sort columns state display logic

const sortableColumns = ref(null);

watchEffect(() => {
  if (!props.useSort) {
    // disable all sorting by putting every element's sortDirection to null
    sortableColumns.value = props.columns.map((column) => {
      return {
        ...column,
        sortDirection: null,
      };
    });
  } else {
    sortableColumns.value = props.columns.map((column) => {
      return {
        ...column,
        sortDirection: column?.sortable ? 'none' : null,
      };
    });
  }
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

const onSortColumn = (sortingColumn, columnIndex) => {
  sortableColumns.value = updateSortableColumns(sortingColumn, props.columns);

  /**
   * Note: the received sortingColumn contains the outdated column sorting info.
   * We therefore extract the updated column info from the just updated sortableColumns
   */
  emit('sort', { ...sortableColumns.value[columnIndex], columnIndex });
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
