<template>
  <table>
    <thead>
      <template v-for="column in sortableColumns">
        <th
          v-if="isColumnActive(column.name)"
          scope="col"
          :aria-sort="column.sortOrder"
        >
          <button
            v-if="column.sortOrder"
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
</template>

<script setup>
import { computed, ref } from 'vue';
const props = defineProps({
  // columns must specify the column name and an optional sortable parameter
  columns: { type: Array, required: true },
  activeColumnNames: { type: Array, required: true },
  rowHeader: { type: String, default: null },
  tableData: { type: Array, required: true },
});

/**
 * Not: sorting and pagination is not done on the component to allow for more flexible logic. By emitting sort and paginate events, the parent can implement both
 * client side and server side sorting+paginating solutions
 */
const emit = defineEmits(['sort']);

/////////////////////////////////////////////////////
// Sorting columns logic

/**
 * Props are not modifiable from the component, so here we assign the received columns to a computed value.
 * In order to change the computed value according to the table control, we insert an external ref currentSortColumn.
 * Therefore, by triggering modifications on this parameter, the computed properties is recomputed with the information about the sorting.
 * */
const currentSortColumn = ref({}); //initialized on the very first required sort
const sortableColumns = computed(() => {
  return props.columns.map((column) => {
    let sortOrder = null; // null is used for non sortable columns. This removes the aria-sort attribute from the corresponding HTML tag
    if (column?.sortable) {
      if (column.name === currentSortColumn.value?.name)
        sortOrder = currentSortColumn.value.sortOrder;
      else sortOrder = 'none'; // "none" is use to express a sortable column which is not the currently sorting column
    }
    return { name: column.name, sortOrder };
  });
});

const onSortColumn = (column) => {
  // action triggered only for sortable columns
  if (column.sortOrder) {
    if (currentSortColumn.value.name === column.name) {
      currentSortColumn.value.sortOrder =
        currentSortColumn.value.sortOrder === 'none'
          ? 'ascending'
          : currentSortColumn.value.sortOrder === 'ascending'
            ? 'descending'
            : 'ascending';
    } else {
      currentSortColumn.value = { name: column.name, sortOrder: 'ascending' };
    }
    const columnIndex = props.columns
      .map(({ name }) => name)
      .indexOf(column.name);

    sort(column, columnIndex);

    emit('sort', { ...currentSortColumn.value, columnIndex });
  }
};

const sort = (column, columnIndex) => {
  const orderMultiplier = column.sortOrder === 'ascending' ? 1 : -1;

  const columnSortFn = column.sortFn ? column.sortFn : (a, b) => a - b;

  const sortFn = (a, b) => {
    const order = columnSortFn(a, b);
    return order * orderMultiplier;
  };

  const sortedColumnData = props.tableData
    .map((row, idx) => ({
      idx,
      value: row[columnIndex],
    }))
    .sort((a, b) => sortFn(a.value, b.value));

  return sortedColumnData.map(({ idx }) => props.tableData[idx]);
};

/////////////////////////////////////////////////////

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

/////////////////////////////////////////////
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
