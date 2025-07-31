<template>
  <!-- Evaluate to rewrite taking advantage of <details><summary></summary></details> native HTML elements (current problem: poor animation customization)-->
  <div class="accordion">
    <component :is="`h${headingLevel}`">
      <button
        :id="idButton"
        class="ht-reset"
        type="button"
        :aria-expanded="isExpanded"
        :aria-controls="idPanel"
        @click="onClick"
      >
        <!-- Use a <span> element to add classes for styling text -->
        <slot name="header"></slot>
        <HTIcon type="chevron-down" />
      </button>
    </component>
    <div
      :id="idPanel"
      class="panel"
      role="region"
      :aria-labelledby="idButton"
      :aria-hidden="!isExpanded"
    >
      <div>
        <slot name="panel"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { v4 as uuidv4 } from 'uuid';
import { ref } from 'vue';
import HTIcon from './HTIcon.vue';

defineProps({
  headingLevel: { type: Number, default: 2 },
  // SSR only
  idButton: {
    type: String,
    default: () => uuidv4(),
  },
  // SSR only
  idPanel: {
    type: String,
    default: () => uuidv4(),
  },
});

const isExpanded = ref(false);

const onClick = () => {
  isExpanded.value = !isExpanded.value;
};
</script>

<style scoped>
.accordion {
  --animation-time: 200ms;

  & > :is(h1, h2, h3, h4, h5, h6) {
    color: var(--accordion-header-text-color, inherit);
  }

  & > :is(h1, h2, h3, h4, h5, h6) > button {
    display: flex;
    gap: 0.5em;
    align-items: center;
    justify-content: space-between;
    text-align: left;

    & > *:last-child {
      flex-shrink: 0;
      transition: transform var(--animation-time) ease-out;
    }

    &[aria-expanded='true'] > *:last-child {
      transform: rotate(180deg);
    }
  }
}

.panel {
  color: var(--accordion-panel-color, inherit);
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--animation-time) ease-in-out;

  &[aria-hidden='false'] {
    grid-template-rows: 1fr;
    margin-top: var(--size-3);
  }

  & > div {
    overflow: hidden;
  }
}
</style>
