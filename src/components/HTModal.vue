<template>
  <dialog id="modal" class="modal" ref="modalDialog">
    <div class="modal-header">
      <div><slot name="header"></slot></div>
      <ht-button-icon
        class="modal-close-button"
        icon-type="x"
        type="button"
        aria-controls="modal"
        @click="showModal = false"
      ></ht-button-icon>
    </div>
    <div class="modal-content"><slot></slot></div>
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
.modal {
  position: relative;
  padding: 0;
  background-color: var(--ht-surface-1);
}

.modal-close-button {
  justify-self: center;
  align-self: start;
  cursor: pointer;
}

.modal-header {
  display: grid;
  grid-template-columns: 1fr var(--size-6);
  position: sticky; /* Keeps the header fixed at the top */
  top: 0;
  z-index: 10;
  background-color: var(--ht-surface-1);
  padding-block: var(--size-2);
  padding-left: var(--size-6);
}

.modal-content {
  padding-inline: var(--size-6);
}
</style>
