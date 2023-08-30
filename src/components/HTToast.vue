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

<script>
export default {
  name: 'HTToast',
  props: {
    type: { type: String, required: true },
    title: { type: String, required: true },
    toastId: { type: [String, Number], required: true },
  },
  emits: ['close-notification'],
  setup(props, { emit }) {
    function onClick() {
      emit('close-notification', props.toastId);
    }
    return { onClick };
  },
};
</script>
