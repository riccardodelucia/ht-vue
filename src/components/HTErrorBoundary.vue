<!--
  HTErrorBoundary.vue

  This component acts as an error boundary for its child components.
  It uses Vue's onErrorCaptured lifecycle hook to catch errors thrown by components rendered in its default slot.
  If an error occurs, it renders the 'error' slot and provides the error object and a clearError function as slot props.
  If no error is present, it renders the 'default' slot as usual.
  This allows you to display a custom fallback UI and optionally let users retry or recover from errors,
  preventing your app from crashing due to rendering errors in child components.

  Usage example:

    <HTErrorBoundary>
      <template #default>
        <SomeComponent />
      </template>
      <template #error="{ error, clearError }">
        <div>
          <p>An error occurred: {{ error.message }}</p>
          <button @click="clearError">Try again</button>
        </div>
      </template>
    </HTErrorBoundary>
-->
<script setup>
import { computed, onErrorCaptured, ref } from 'vue';

const error = ref();

onErrorCaptured((err) => {
  error.value = err;
  return false; // this prevents error from bubbling further
});

function clearError() {
  error.value = null;
}

// Provide the error and the clear error function to the slot for use in consuming component
const slotProps = computed(() => {
  if (!error.value) return {};
  return { error, clearError };
});

const slotName = computed(() => (error.value ? 'error' : 'default'));
</script>

<template>
  <slot :name="slotName" v-bind="slotProps"></slot>
</template>
