<template>
  <div class="tab">
    <div ref="tablist" class="tablist" role="tablist">
      <button
        v-for="(tab, idx) in tabList"
        :key="`${tab.panel}-button`"
        class="tab-button"
        type="button"
        :aria-selected="idx === selected"
        role="tab"
        :aria-controls="`${tab.panel}-tabpanel`"
        @click="onClick(idx)"
      >
        {{ tab.label }}
      </button>
    </div>
    <div>
      <article
        v-for="(tab, idx) in tabList"
        :id="`${tab.panel}-tabpanel`"
        :key="`${tab.panel}-tabpanel`"
        class="ht-card"
        role="tabpanel"
        :tabindex="idx === selected ? 0 : -1"
        :class="[{ 'tab-hidden': idx !== selected }]"
      >
        <slot :name="tab.panel"></slot>
      </article>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HTTab',
  props: {
    tabList: {
      type: Array,
      required: true,
    },
  },
  emits: ['tab-selected'],
  data() {
    return { selected: 0 };
  },
  methods: {
    onClick(idx) {
      this.selected = idx;
      this.$emit('tab-selected', idx);
    },
  },
};
</script>

<style lang="postcss" scoped>
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
