<template>
  <fieldset class="checklist-group">
    <legend v-if="label">{{ label }}</legend>

    <!-- Select All -->
    <div class="checklist-select-all">
      <div>
        <ht-checkbox-select-all
          v-model="selectedOptions"
          :label="selectAllLabel"
          :options="props.options"
        />
      </div>
      <span
        v-if="errorMessage"
        class="ht-input-error-message"
        aria-live="assertive"
        >{{ errorMessage }}</span
      >
    </div>

    <!-- Selected + draggable -->
    <draggable
      v-model="selectedOptions"
      :item-key="(item) => item"
      handle=".drag-handle"
      tag="ul"
      class="checklist-list selected-list"
      :animation="300"
    >
      <template #item="{ element: option }">
        <li class="checklist-item">
          <HTIcon type="menu" class="drag-handle" />
          <ht-checkbox
            :key="option"
            v-model="selectedOptions"
            :label="labelMap.get(option)"
            :value="option"
          />
        </li>
      </template>
    </draggable>

    <!-- Unselected checkboxes -->
    <ul class="checklist-list unselected-list">
      <li
        v-for="option in unselectedOptions"
        :key="option"
        class="checklist-item"
      >
        <span class="drag-placeholder"></span>
        <ht-checkbox
          v-model="selectedOptions"
          :label="labelMap.get(option)"
          :value="option"
          @change="moveToSelected(option)"
        />
      </li>
    </ul>
  </fieldset>
  <button @click="handleSubmitSelection">Submit selection</button>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import draggable from 'vuedraggable';
import HTIcon from './HTIcon.vue';

const props = defineProps({
  label: {
    // Optional label displayed above the checklist
    type: String,
    default: null,
  },
  options: {
    // Array of selectable values (required, all values must be primitives)
    type: Array,
    required: true,
  },
  optionLabels: {
    // Optional array of labels corresponding to each option.
    type: Array,
    default: () => [],
  },
  selectAllLabel: {
    // Label text for the "Select All" checkbox
    type: String,
    default: 'Select All',
  },
});

const emit = defineEmits(['submit']);

// Selected options (internal only)
const selectedOptions = ref([]);

// Unselected options
const unselectedOptions = computed(() =>
  props.options.filter((opt) => !selectedOptions.value.includes(opt)),
);

const errorMessage = ref(null);

/**
 * Map each option value to its label.
 * Assumes primitive option values. This ensures stable mapping even if options are reordered.
 */
const labelMap = computed(() => {
  const map = new Map();
  props.options.forEach((opt, idx) => {
    map.set(opt, props.optionLabels[idx] || String(opt));
  });
  return map;
});

// Move a checkbox to selected list when clicked
const moveToSelected = (option) => {
  if (!selectedOptions.value.includes(option)) {
    selectedOptions.value.push(option);
  }
};

// Emit final ordered list
const handleSubmitSelection = () => {
  if (selectedOptions.value.length === 0) {
    console.error('Nessuna opzione selezionata');
    errorMessage.value = "Seleziona almeno un'opzione prima di procedere";
    return;
  }

  errorMessage.value = null;
  emit('submit', [...selectedOptions.value]);
};

/**
 * Watch for changes to the options prop.
 * - Filters selectedOptions to only include currently available options.
 * - Updates localOptions to reflect any changes from the parent.
 */
watch(
  () => props.options,
  () => {
    const newSelections = props.options.filter((newOption) => {
      return selectedOptions.value.includes(newOption);
    });
    selectedOptions.value = newSelections;
    errorMessage.value = null;
  },
);
</script>

<style scoped>
.checklist-group {
  border: 1px solid var(--ht-color-border, #eee);
  border-radius: var(--border-radius, 4px);
  padding: var(--size-4);
  margin-bottom: var(--size-4);
}

.checklist-select-all {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--size-2);
}

.checklist-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.selected-list {
  background: var(--ht-color-bg-2, #f7f7f7);
}

.checklist-item {
  display: flex;
  align-items: center;
  gap: var(--size-2);
  padding: var(--size-2);
}

.checklist-item ::v-deep(input) {
  margin-left: 0.2rem;
}

.checklist-item:active {
  background: var(--ht-color-bg-3, #e0e0e0);
}

.drag-handle {
  cursor: grab;
}

.drag-placeholder {
  display: inline-flex;
  width: 1rem;
  justify-content: center;
  margin-right: 0.5rem;
}
</style>
