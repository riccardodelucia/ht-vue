<template>
  <div class="tab">
    <div ref="tablist" class="tablist" role="tablist">
      <button
        v-for="(tab, idx) in tabs"
        :key="`tab-button-${idx}`"
        class="tab-button"
        type="button"
        :aria-selected="tab === selected"
        role="tab"
        :aria-controls="`tabpanel-${id}-${idx}`"
        @click="onClick(tab)"
      >
        {{ tabLabels[idx] || tab }}
      </button>
    </div>
    <div>
      <article
        v-for="(tab, idx) in tabs"
        :id="`tabpanel-${id}-${idx}`"
        :key="`tabpanel-${idx}`"
        class="ht-card"
        role="tabpanel"
        :tabindex="tab === selected ? 0 : -1"
        :class="[{ 'tab-hidden': tab !== selected }]"
      >
        <slot :name="tab"></slot>
      </article>
    </div>
  </div>
</template>

<script setup>
import { v4 as uuidv4 } from 'uuid';

defineProps({
  tabs: {
    type: Array,
    required: true,
  },
  tabLabels: { typer: Array, default: () => [] },
  // SSR only
  id: {
    type: String,
    default: () => uuidv4(),
  },
});

const selected = defineModel({ type: String });

const onClick = (tab) => {
  selected.value = tab;
};
</script>

<style scoped>
.tab {
  width: fit-content;
}

.tab-button {
  padding: 1em 2em;
  background: transparent;
  color: var(--ht-text-color-1);
  border: none;
  border-radius: 0;
}

.tablist {
  background: var(--ht-surface-3);
}

.tab-button[aria-selected='true'] {
  background: var(--ht-surface-1);
  position: relative;
  border-left: 1px solid var(--ht-color-gray-1);
  border-right: 1px solid var(--ht-color-gray-1);
}
.tab-button[aria-selected='true']::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  border-top: 4px solid var(--ht-color-primary);
}
.tab-button[aria-selected='true']::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  border-bottom: 4px solid var(--ht-surface-1);
}

article {
  border-radius: 0;
}

.tab-hidden {
  display: none;
}
</style>
