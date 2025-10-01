<template>
  <div class="search-bar">
    <div class="search-tags">
      <span
        v-for="(filter, idx) in appliedFilters"
        :key="idx"
        class="search-tag"
      >
        <ht-button-icon @click="onTagRemove(idx)" icon-type="x-circle" />
        <div class="tag-content">
          <span
            class="ellipsis"
            @mouseenter="handleTooltip($event, filter.column)"
            @mouseleave="hideTooltip"
          >
            {{ filter.column }}
          </span>
        </div>
      </span>
    </div>

    <button class="button-with-icon" @click="openModal">
      <span>Manage filters</span>
      <ht-icon type="filter" />
    </button>

    <ht-modal v-model:show-modal="showModal">
      <template #header><h3>Advanced Search</h3></template>
      <div class="ht-layout-stack modal-content" style="--stack-space: 0.5rem">
        <p>
          To filter results, add at least one filter using "Add filter" below,
          then click "Apply" to activate your search criteria.
        </p>

        <p
          v-if="errorMessage"
          class="ht-input-error-message"
          aria-live="assertive"
        >
          {{ errorMessage }}
        </p>

        <p v-if="editingFilters.length === 0">
          <em>No filters are currently set.</em>
        </p>

        <div
          v-else
          v-for="(filter, idx) in editingFilters"
          :key="idx"
          class="search-row"
        >
          <ht-select
            v-model="filter.column"
            :options="columnOptions"
            disabledOptionLabel="Search column:"
          />
          <ht-input v-model="filter.value" placeholder="Search value" />
          <button @click="removeFilter(idx)" data-type="ghost">Remove</button>
        </div>

        <div class="modal-actions">
          <button @click="addFilter" class="button-with-icon" data-type="ghost">
            <ht-icon type="plus" />
            <span>Add filter</span>
          </button>
          <button
            @click="applyFilters"
            class="button-with-icon"
            data-type="primary"
          >
            <ht-icon type="check" />
            <span>Apply</span>
          </button>
        </div>
      </div>
    </ht-modal>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useTooltip } from '../composables';

const props = defineProps({
  columnOptions: { type: Array, required: true },
});

const emit = defineEmits(['search-filters']);

const showModal = ref(false);

const errorMessage = ref('');

const { showTooltip, hideTooltip } = useTooltip({ animation: false });

// Array of filters that are currently applied (shown as tags): each is an object { column, value }
const appliedFilters = ref([]);

//  Array of filters being edited in the modal: each is an object { column, value }
const editingFilters = ref([]);

// Open the modal and copy applied filters to editing filters
function openModal() {
  showModal.value = true;
  resetError();
  editingFilters.value = appliedFilters.value.length
    ? appliedFilters.value.map((f) => ({ ...f }))
    : [];
}

// Add a new filter to the editing list
function addFilter() {
  if (editingFilters.value.length < 4) {
    editingFilters.value.push({
      column: props.columnOptions[0] ?? '',
      value: '',
    });
    resetError();
  } else {
    errorMessage.value = 'Maximum of 4 filters allowed.';
  }
}

// Remove a filter from the editing list
function removeFilter(idx) {
  editingFilters.value.splice(idx, 1);
  resetError();
}

// Validate and emit list of filters to the parent
function applyFilters() {
  // Check for invalid filters (empty or whitespace value)
  const invalid = editingFilters.value.some(
    (f) => !f.value || f.value.trim() === '',
  );
  if (invalid) {
    errorMessage.value = 'Please fill in all filter values before applying.';
    return;
  }
  resetError();
  // Update applied filters and emit to parent
  appliedFilters.value = [...editingFilters.value];
  emit('search-filters', appliedFilters.value);
  showModal.value = false;
}

// Remove a filter directly from the applied filters (tag)
function onTagRemove(idx) {
  appliedFilters.value.splice(idx, 1);
  emit('search-filters', appliedFilters.value);
}

// Reset the error message if the current state resolves the previous error.
function resetError() {
  if (
    editingFilters.value.length < 4 &&
    errorMessage.value === 'Maximum of 4 filters allowed.'
  ) {
    errorMessage.value = '';
  }
  if (
    errorMessage.value ===
      'Please fill in all filter values before applying.' &&
    editingFilters.value.every((f) => f.value && f.value.trim() !== '')
  ) {
    errorMessage.value = '';
  }
}

// Shows a tooltip only if the content of the tag is visually truncated (ellipsis).
function handleTooltip(event, content) {
  const el = event.target;
  // Mostra il tooltip solo se il testo è troncato
  if (el.offsetWidth < el.scrollWidth) {
    showTooltip(event, content);
  }
}

// If columnOptions prop changes, resets all filters (applied or editing)
watch(
  () => props.columnOptions,
  (newOptions) => {
    const validColumns = new Set(newOptions);
    appliedFilters.value = appliedFilters.value.filter((f) =>
      validColumns.has(f.column),
    );
    editingFilters.value = editingFilters.value.filter((f) =>
      validColumns.has(f.column),
    );
    applyFilters();
  },
);
</script>

<style scoped>
.button-with-icon {
  display: flex;
  gap: 0.5rem;
}

.search-bar {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: end;
  gap: 1rem;
}

.search-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.search-tag {
  background: var(--ht-surface-4);
  color: var(--ht-text-color-1);
  border-radius: 2rem;
  padding: 0.5rem;
  font-size: smaller;
  display: flex;
  gap: 0.5rem;
}

.tag-content {
  display: flex;
  align-items: center;
}

.ellipsis {
  max-width: 7rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
}
.modal-content {
  margin-top: 1rem;
  margin-bottom: 1.5rem;
  width: 100%;
}

.search-row {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}
</style>
