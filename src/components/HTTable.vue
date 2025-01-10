<template>
  <table>
    <thead>
      <template v-for="column in columnHeaders">
        <th v-if="activeColumnHeaders.includes(column)" scope="col">
          {{ column }}
        </th>
      </template>
    </thead>
    <tbody>
      <!-- <tr v-for="row in activeColumnsTableData">
        <template v-for="(column, idx) in row">
          <th v-if="column.th" scope="row">{{ column.data }}</th>
          <td v-else>{{ column.data }}</td>
        </template>
      </tr> -->
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

const activeColumnsTableData = computed(() => {
  return props.tableData.reduce((acc, rowData) => {
    const row = rowData.map((columnData, idx) => {
      return {
        column: props.columnHeaders[idx],
        data: columnData,
        th: idx === 0,
      };
    });
    acc.push(row);
    return acc;
  }, []);
});

const orderedActiveColumnHeaders = computed(() => {
  return props.activeColumnHeaders
    .map((activeHeader) => {
      const index = props.columnHeaders.indexOf(activeHeader);
      return { index, activeHeader };
    })
    .sort((a, b) => a.index - b.index)
    .map(({ activeHeader }) => activeHeader);
});
</script>

<style lang="postcss" scoped></style>
