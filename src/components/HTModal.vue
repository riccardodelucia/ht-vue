<template>
  <dialog class="modal" ref="modalDialog">
    <ht-button-icon
      class="modal-close-button"
      icon-type="x"
      type="button"
      @click="closeModal"
    ></ht-button-icon>
    <slot></slot>
  </dialog>
</template>

<script setup>
import { ref, watchEffect } from 'vue';

const showModal = defineModel('show', { type: Boolean, default: false });

const emit = defineEmits(['close']);

const modalDialog = ref(null);

const body = document.querySelector('body');

watchEffect(() => {
  if (showModal.value === true) {
    body.classList.add('ht-prevent-scroll');
    modalDialog.value.showModal();
  }
});

const closeModal = () => {
  body.classList.remove('ht-prevent-scroll');
  modalDialog.value.close();
  showModal.value = false;
  emit('update:show', model.value);
};
</script>

<style lang="postcss" scoped>
.modal {
  //position: relative;
  margin: auto; /* Center the dialog without scrolling the page */
  position: fixed; /* Prevent it from affecting document flow */
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
}
.modal-close-button {
  position: absolute;
  top: 0.5em;
  right: 0.5em;
}
</style>
