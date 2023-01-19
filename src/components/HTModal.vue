<template>
  <transition name="fade">
    <div class="modal" @click.self="$emit('modal-close')">
      <div class="modal__dialog">
        <div class="modal__header">
          <slot name="header"></slot>
          <a class="modal__close" @click="$emit('modal-close')"></a>
        </div>
        <div class="modal__body">
          <slot name="body"></slot>
        </div>
        <div class="modal__footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
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
