<template>
  <div class="accordion">
    <input
      :id="uuid"
      class="accordion__checkbox"
      type="checkbox"
      @change="isOpen = !isOpen"
    />
    <label :for="uuid" class="accordion__label">
      <vue-feather v-if="!isOpen" type="plus-circle"></vue-feather>
      <vue-feather v-else type="minus-circle"></vue-feather>
      <span>{{ label }}</span>
    </label>
    <div
      class="accordion__collapsible-content"
      :style="{
        'max-height': collapsed,
      }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';

import { ref, computed } from 'vue';

export default {
  name: 'HTAccordion',
  props: {
    label: { type: String, default: '' },
    height: {
      type: String,
      default: 'min-content',
    },
  },
  setup(props) {
    const uuid = uuidv4();
    const isOpen = ref(false);

    const collapsed = computed(() => {
      return isOpen.value ? props.height : 0;
    });

    return { uuid, isOpen, collapsed };
  },
};
</script>
