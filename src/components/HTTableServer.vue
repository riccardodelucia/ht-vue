<template>
  <div>
    <table>
      <thead>
        <template v-for="(column, idx) in sortableColumns">
          <th
            v-if="isColumnActive(column.name)"
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
          <template v-for="columnIndex in nColumns">
            <template v-if="isColumnActive(columnNames[columnIndex - 1])">
              <!-- register a slot for each available cell to give the parent the opportunity to specifically override that column content with
             custom HTML-->
              <slot
                :column="columnNames[columnIndex - 1]"
                :rowIndex="rowIndex"
                :tableData="tableData[rowIndex - 1][columnIndex - 1]"
              >
                <!-- standard content, if not overrideen by the parent -->
                <th v-if="columnIndex - 1 === rowHeaderIndex" role="row">
                  {{ tableData[rowIndex - 1][columnIndex - 1] }}
                </th>
                <td v-else>
                  {{ tableData[rowIndex - 1][columnIndex - 1] }}
                </td>
              </slot>
            </template>
          </template>
        </tr>
      </tbody>
    </table>
    <ht-pagination
      v-if="availablePages > 0"
      v-model:page="page"
      :available-pages="availablePages"
      :displayable-pages="displayablePages"
    ></ht-pagination>
  </div>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue';
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

/**
 * Not: sorting and pagination is not done on the component to allow for more flexible logic. By emitting sort and paginate events, the parent can implement both
 * client side and server side sorting+paginating solutions
 */
const emit = defineEmits(['sort']);

// The page is linked to a model which in turns emits a page event to the parent. This allow to query the specified page data on the server and sync the current page to the pagination component.
const page = defineModel('page', { type: Number });

/////////////////////////////////////////////////////
// General logic
const nRows = computed(() => props.tableData.length);
const nColumns = computed(() => props.tableData[0].length);

const columnNames = computed(() => props.columns.map(({ name }) => name));

const rowHeaderIndex = computed(() => {
  // it computes the cell index of the column which acts as the name for every row
  if (props.rowHeader) {
    return columnNames.value.indexOf(props.rowHeader);
  }
  return -1;
});

// used to compute if the current cell must be shown or not.
const isColumnActive = (name) => props.activeColumnNames.includes(name);

/////////////////////////////////////////////////////
// Sorting logic

const sortableColumns = ref(null);

watchEffect(() => {
  sortableColumns.value = props.columns.map((column) => {
    return {
      ...column,
      sortDirection: column?.sortable ? 'none' : null,
    };
  });
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
  emit('sort', { ...sortableColumns.value[columnIndex] });
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
