<template>
  {{ sortableColumns }}<br />
  {{ currentSortKey }}
  <table>
    <thead>
      <template v-for="column in sortableColumns">
        <th
          v-if="isColumnActive(column.header)"
          scope="col"
          :aria-sort="column.sortOrder"
        >
          <button
            v-if="isSortable(column.header)"
            class="sort-button"
            type="button"
            :aria-label="`Sort toggle for column ${column.header}`"
            @click="onClick(column.header)"
          >
            {{ column.header }}
          </button>
          <template v-else>{{ column.header }}</template>
        </th>
      </template>
    </thead>
    <tbody>
      <tr v-for="rowIndex in nRows">
        <template v-for="columnIndex in nColumns">
          <template v-if="isColumnActive(columnHeaders[columnIndex - 1])">
            <!-- register a slot for each available cell to give the parent the opportunity to specifically override that column content with
             custom HTML-->
            <slot
              :column="columnHeaders[columnIndex - 1]"
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
  // columns must specify the column header name and an optional isSortable parameter
  columns: { type: Array, required: true },
  activeColumnHeaders: { type: Array, required: true },
  rowHeader: { type: String, default: null },
  tableData: { type: Array, required: true },
});

/////////////////////////////////////////////////////
// Sorting columns logic
const initialSortKeyHeader = props.columns.find(
  (column) => column?.sortable === true,
);

const currentSortKey = ref(
  initialSortKeyHeader
    ? { header: initialSortKeyHeader.header, sortOrder: 'none' }
    : undefined,
);

const isSortable = (columnHeader) =>
  props.columns.find(
    (column) => column.header === columnHeader && column?.sortable === true,
  );

const sortableColumns = computed({
  get() {
    return props.columns.map((column) => {
      let sortOrder = null; // null is used for non sortable columns, to remove ARIA-attribute from the corresponding HTML tag
      if (column?.sortable) {
        if (column.header === currentSortKey.value?.header)
          sortOrder = currentSortKey.value.sortOrder;
        else sortOrder = 'none'; // "none" is use to express a sortable column which is not the currently sorting column
      }
      return { header: column.header, sortOrder };
    });
  },
  set(value) {
    if (isSortable(value)) {
      if (currentSortKey.value.header === value) {
        currentSortKey.value.sortOrder =
          currentSortKey.value.sortOrder === 'none'
            ? 'ascending'
            : currentSortKey.value.sortOrder === 'ascending'
              ? 'descending'
              : 'ascending';
      } else {
        currentSortKey.value = { header: value, sortOrder: 'ascending' };
      }
    }
  },
});

const onClick = (value) => (sortableColumns.value = value);
/////////////////////////////////////////////////////

const nRows = computed(() => props.tableData.length);
const nColumns = computed(() => props.tableData[0].length);

const columnHeaders = computed(() => props.columns.map(({ header }) => header));

const rowHeaderIndex = computed(() => {
  // it computes the cell index of the column which acts as the header for every row
  if (props.rowHeader) {
    return columnHeaders.value.indexOf(props.rowHeader);
  }
  return -1;
});

// used to compute if the current cell must be shown or not.
const isColumnActive = (header) => props.activeColumnHeaders.includes(header);

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
