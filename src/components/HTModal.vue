<template>
  <dialog id="modal" class="modal" ref="modalDialog">
    <div class="modal-close-button-container">
      <ht-button-icon
        class="modal-close-button"
        icon-type="x"
        type="button"
        aria-controls="modal"
        @click="showModal = false"
      />
    </div>
    <div class="modal-header">
      <slot name="header"></slot>
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
  padding: 0;
  background-color: var(--ht-surface-1);
  position: fixed;
  inset: 0 0 0 0;
  margin: auto;
}

.modal-close-button-container {
  display: flex;
  justify-content: end;
  align-content: center;
  height: 2rem;
  padding-top: var(--size-2);
  padding-inline: var(--size-3);
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
}

.modal-close-button {
  cursor: pointer;
}

.modal-header,
.modal-content {
  padding-inline: var(--size-6);
  overflow: hidden;
}
</style>
