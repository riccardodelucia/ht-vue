<template>
  <table>
    <thead>
      <th v-for="column in orderedActiveColumnHeaders" scope="col">
        {{ column }}
      </th>
    </thead>
    <tbody>
      <!-- <tr>
        <template v-for="(column, idx) in columnData">
          <th v-if="idx === 0" scope="row">{{ column }}</th>
          <td v-else>{{ column }}</td>
        </template>
      </tr> -->
    </tbody>
  </table>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  columnHeadersReference: { type: Array, required: true },
  activeColumnHeaders: { type: Array, required: true },
  activeColumnData: { type: Array, required: true },
});

const orderedActiveColumnHeaders = computed(() => {
  return props.activeColumnHeaders
    .map((activeHeader) => {
      const index = props.columnHeadersReference.indexOf(activeHeader);
      return { index, activeHeader };
    })
    .sort((a, b) => a.index - b.index)
    .map(({ activeHeader }) => activeHeader);
});
</script>

<style lang="postcss" scoped></style>
