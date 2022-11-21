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
      <slot name="title">Title</slot>
    </label>
    <div
      class="accordion__collapsible-content"
      :style="{
        'max-height': collapsed,
      }"
    >
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
import UniqueID from "@/composables/uuid.js";
import { ref, computed } from "vue";

export default {
  name: "HTAccordion",
  props: {
    height: {
      type: String,
      default: "min-content",
    },
  },
  setup(props) {
    const uuid = UniqueID();
    const isOpen = ref(false);

    const collapsed = computed(() => {
      return isOpen.value ? props.height : 0;
    });

    return { uuid, isOpen, collapsed };
  },
};
</script>
