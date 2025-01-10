<template>
  <table>
    <thead>
      <template v-for="columnInfo in columnHeadersInfo">
        <th
          v-if="isColumnActive(columnInfo.column)"
          scope="col"
          :data-sorting="
            columnInfo?.isSortable
              ? currentSortKey === columnInfo.column
                ? sortOrders[column.name] > 0
                  ? 'sorting-asc'
                  : 'sorting-desc'
                : 'sorting'
              : ''
          "
          @click="columnInfo?.isSortable && sortBy(column.name)"
        >
          {{ columnInfo.column }}
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
import { computed } from 'vue';
const props = defineProps({
  // columnHeadersInfo must specify the column name and an option isSortable parameter
  columnHeadersInfo: { type: Array, required: true },
  activeColumnHeaders: { type: Array, required: true },
  rowHeader: { type: String, default: null },
  tableData: { type: Array, required: true },
});

const nRows = computed(() => props.tableData.length);
const nColumns = computed(() => props.tableData[0].length);

const columnHeaders = computed(() =>
  props.columnHeadersInfo.map(({ column }) => column),
);

const rowHeaderIndex = computed(() => {
  if (props.rowHeader) {
    return columnHeaders.value.indexOf(props.rowHeader);
  }
  return -1;
});

const isColumnActive = (column) => props.activeColumnHeaders.includes(column);
</script>

<style lang="postcss" scoped></style>
