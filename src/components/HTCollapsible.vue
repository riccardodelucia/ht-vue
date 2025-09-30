<template>
  <div class="collapsible">
    <div class="collapsible-header" @click="collapsed = !collapsed">
      <slot name="header"></slot>
      <ht-icon type="chevron-down" class="collapsible-icon" />
    </div>
    <div class="panel" v-show="collapsed">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  initiallyExpanded: { type: Boolean, default: false },
});

const collapsed = ref(props.initiallyExpanded);

const rotation = computed(() => (collapsed.value ? '0deg' : '180deg'));
</script>

<style scoped>
.collapsible-header {
  display: grid;
  grid-template-columns: 1fr 2rem;
  cursor: pointer;
}

.collapsible-icon {
  justify-self: end;
  align-self: center;
}

.collapsible-icon > :last-child {
  transition: transform 200ms ease-out;
  transform: rotate(v-bind(rotation));
  cursor: pointer;
}
</style>
