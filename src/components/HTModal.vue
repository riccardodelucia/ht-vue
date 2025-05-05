<template>
  <dialog id="modal" class="modal" ref="modalDialog">
    <ht-button-icon
      class="modal-close-button"
      icon-type="x"
      type="button"
      aria-controls="modal"
      @click="showModal = false"
    ></ht-button-icon>
    <slot></slot>
  </dialog>
</template>

<script setup>
import { ref, watchEffect } from 'vue';

const showModal = defineModel('showModal', { type: Boolean, default: false });

const modalDialog = ref(null);

const body = document.querySelector('body');

watchEffect(() => {
  if (showModal.value === true) {
    modalDialog.value?.showModal();
    body.classList.add('ht-prevent-scroll');
  } else {
    body.classList.remove('ht-prevent-scroll');
    modalDialog.value?.close();
  }
});
</script>

<style lang="postcss" scoped>
.modal-close-button {
  position: absolute;
  top: 0.5em;
  right: 0.5em;
}
</style>
