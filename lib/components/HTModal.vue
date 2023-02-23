<template>
  <div class="overlay" @click.self="$emit('modal-close')">
    <div class="modal">
      <a class="modal__close" @click="$emit('modal-close')"></a>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HTModal',
  emits: { 'modal-close': null },
  mounted() {
    const body = document.querySelector('body');
    body.style.overflow = 'hidden';
  },
  unmounted() {
    const body = document.querySelector('body');
    body.style.overflow = 'auto';
  },
};
</script>
