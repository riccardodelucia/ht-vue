<template>
  <div class="ht-toast" :data-type="type === 'error' ? 'error' : null">
    <h2>{{ title }}</h2>
    <button
      class="ht-reset"
      type="button"
      aria-label="Close"
      @click="onClick(notification)"
    >
      <span class="ht-visually-hidden">Close Toast</span>
    </button>
    <slot></slot>
  </div>
</template>

<script setup>
const props = defineProps({
  type: { type: String, required: true },
  title: { type: String, required: true },
  toastId: { type: [String, Number], required: true },
});
const emit = defineEmits(['close-notification']);
const onClick = () => {
  emit('close-notification', props.toastId);
};
</script>
