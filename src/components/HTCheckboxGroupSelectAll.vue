<template>
  <div class="checkbox-group-container">
    <ht-checkbox
      ref="checkboxSelectAll"
      class="checkbox-select-all"
      label="De/Select All"
      :model-value="selectAll"
      @update:model-value="onChecboxSelectAllUpdated"
    ></ht-checkbox>
    <div
      v-for="(option, idx) in checkboxOptions"
      :key="`checkbox-options-${idx}`"
      class="checkbox-options-container"
    >
      <ht-checkbox
        v-model="model"
        :label="internalCheckboxOptionsLabels[idx]"
        :value="option"
      ></ht-checkbox>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue';

const selectAll = ref(false);

const selectAllCheckboxStates = {
  UNSELECTED: 'unselected',
  INDETERMINATE: 'indeterminate',
  SELECTED: 'selected',
};
const selectAllState = ref(selectAllCheckboxStates.UNSELECTED);

const checkboxSelectAll = ref(null);

const props = defineProps({
  checkboxOptions: { type: Array, required: true },
  checkboxOptionsLabels: { type: Array, required: false },
});
const model = defineModel({ type: Array, required: true }); // array of checkbox selections

if (props.checkboxOptions.length === 0)
  throw new Error('Checkbox group requires at least one option to work');

const internalCheckboxOptionsLabels = computed(() => {
  if (
    props.checkboxOptionsLabels.length === 0 ||
    props.checkboxOptionsLabels.length !== props.checkboxOptions.length
  ) {
    return [...props.checkboxOptions];
  }
  return [...props.checkboxOptionsLabels];
});

const onChecboxSelectAllUpdated = (value) => {
  model.value = value ? props.checkboxOptions : [];
  selectAll.value = value;
};

watchEffect(() => {
  if (model.value.length === props.checkboxOptions.length) {
    selectAll.value = true;
    selectAllState.value = selectAllCheckboxStates.SELECTED;
    checkboxSelectAll.value?.resetIndeterminate();
  } else if (model.value.length === 0) {
    selectAll.value = false;
    selectAllState.value = selectAllCheckboxStates.UNSELECTED;
    checkboxSelectAll.value?.resetIndeterminate();
  } else {
    selectAll.value = false;
    selectAllState.value = selectAllCheckboxStates.INDETERMINATE;
    checkboxSelectAll.value?.setIndeterminate();
  }
});
</script>

<style lang="postcss" scoped></style>
