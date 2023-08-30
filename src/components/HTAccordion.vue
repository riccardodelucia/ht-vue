<template>
  <!-- Evaluate to rewrite taking advantage of <details><summary></summary></details> native HTML elements (current problem: poor animation customization)-->
  <div class="accordion">
    <component :is="`h${headingLevel}`">
      <button
        :id="uuidButton"
        class="ht-reset"
        type="button"
        :aria-expanded="isExpanded"
        :aria-controls="uuidPanel"
        @click="onClick"
      >
        <!-- Use a <span> element to add classes for styling text -->
        <slot name="header"></slot>
        <VueFeather type="chevron-down"></VueFeather>
      </button>
    </component>
    <div
      :id="uuidPanel"
      class="panel"
      role="region"
      :aria-labelledby="uuidButton"
      :aria-hidden="!isExpanded"
    >
      <div>
        <slot name="panel"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import { ref } from 'vue';
import VueFeather from 'vue-feather';

export default {
  name: 'HTAccordion',
  components: { VueFeather },
  props: {
    headingLevel: { type: Number, default: 2 },
  },
  setup() {
    const isExpanded = ref(false);
    const uuidButton = uuidv4();
    const uuidPanel = uuidv4();

    const onClick = () => {
      isExpanded.value = !isExpanded.value;
    };

    return { isExpanded, onClick, uuidButton, uuidPanel };
  },
};
</script>

<style lang="postcss" scoped>
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

    /* :slotted(span) {
      text-align: left;
    } */
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

  // This instruction is important to ensure the hidden content on closed accordions
  &>div {
    overflow: hidden;
  }
}
</style>
