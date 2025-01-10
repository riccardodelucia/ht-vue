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
          <td v-if="isColumnActive(columnHeaders[columnIndex - 1])">
            {{ tableData[rowIndex - 1][columnIndex - 1] }}
          </td>
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
  tableData: { type: Array, required: true },
});

const nRows = computed(() => props.tableData.length);
const nColumns = computed(() => props.tableData[0].length);

const isColumnActive = (column) => props.activeColumnHeaders.includes(column);
</script>

<style lang="postcss" scoped></style>
