<template>
  <table>
    <thead>
      <template v-for="column in columnHeaders">
        <th v-if="isColumnActive(column)" scope="col">
          {{ column }}
        </th>
      </template>
    </thead>
    <tbody>
      <tr v-for="rowIndex in nRows">
        <template v-for="columnIndex in nColumns">
          <template v-if="isColumnActive(columnHeaders[columnIndex - 1])">
            <th v-if="columnIndex - 1 === rowHeaderIndex" role="row">
              {{ tableData[rowIndex - 1][columnIndex - 1] }}
            </th>
            <td v-else>{{ tableData[rowIndex - 1][columnIndex - 1] }}</td>
          </template>
        </template>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  columnHeaders: { type: Array, required: true },
  activeColumnHeaders: { type: Array, required: true },
  rowHeader: { type: String, default: null },
  tableData: { type: Array, required: true },
});

const nRows = computed(() => props.tableData.length);
const nColumns = computed(() => props.tableData[0].length);

const rowHeaderIndex = computed(() => {
  if (props.rowHeader) {
    return props.columnHeaders.indexOf(props.rowHeader);
  }
  return -1;
});

const isColumnActive = (column) => props.activeColumnHeaders.includes(column);
</script>

<style lang="postcss" scoped></style>
