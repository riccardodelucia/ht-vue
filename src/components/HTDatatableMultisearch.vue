<template>
  <div class="ht-layout-stack" style="--stack-space: 0.5em">
    <button class="button-with-icon" @click="showModal = true">
      <span>Manage filters</span>
      <ht-icon type="filter" />
    </button>

    <div class="search-tags">
      <span v-for="(filter, idx) in filters" :key="idx" class="search-tag">
        <ht-button-icon
          @click="removeFilterAndApply(idx)"
          icon-type="x-circle"
        />
        <div>
          <span class="column-ellipsis" :title="filter.column">
            {{ filter.column }}
          </span>
          <!--    <span> : {{ filter.value }} </span> -->
        </div>
      </span>
    </div>

    <ht-modal v-model:show-modal="showModal">
      <template #header><h3>Advanced Search</h3></template>
      <div>
        <div v-for="(filter, idx) in filters" :key="idx" class="search-row">
          <select v-model="filter.column">
            <option
              v-for="col in columnOptions"
              :key="col.name"
              :value="col.name"
            >
              {{ col.name }}
            </option>
          </select>
          <input v-model="filter.value" placeholder="Search value" />
          <button @click="removeFilter(idx)">Remove</button>
        </div>
        <button @click="addFilter" class="button-with-icon">
          <ht-icon type="plus" />
          <span>Add filter</span>
        </button>
        <button @click="applyFilters">Apply</button>
      </div>
    </ht-modal>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  columnOptions: { type: Array, required: true },
});

const emit = defineEmits(['search-filters']);

const showModal = ref(false);

// Array of active filters: each is { column, value }:
const filters = ref([
  { column: props.columnOptions[0]?.name || '', value: '' },
]);

function addFilter() {
  filters.value.push({ column: props.columnOptions[0]?.name || '', value: '' });
}

function removeFilter(idx) {
  filters.value.splice(idx, 1);
}

function removeFilterAndApply(idx) {
  filters.value.splice(idx, 1);
  emit(
    'search-filters',
    filters.value.filter((f) => f.value),
  );
}

// Emit the list of filters to the parent and close modal
function applyFilters() {
  emit(
    'search-filters',
    filters.value.filter((f) => f.value),
  );
  showModal.value = false;
}
</script>

<style scoped>
.button-with-icon {
  display: flex;
  gap: 0.5em;
}

.search-tags {
  display: flex;
  gap: 0.5em;
}

.search-tag {
  background: var(--ht-surface-4);
  color: var(--ht-text-color-1);
  border-radius: 2rem;
  padding: 0.5rem;
  font-size: smaller;
  display: flex;
  gap: 0.5em;
  align-items: center;
}
</style>
