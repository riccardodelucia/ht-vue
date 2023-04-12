<template>
  <div
    v-if="error !== null"
    class="input-field__error"
    :style="{
      opacity: error !== '' ? 1 : 0,
    }"
  >
    <vue-feather type="alert-circle" size="16px"></vue-feather>
    <!-- the 'error' is used to preallocate the correct div heigth when the element has an empty error message string (falsy value)-->
    <small>{{ error || 'error' }} </small>
  </div>
</template>

<script>
export default {
  name: 'HTInputErrorMessage',
  props: {
    error: {
      // if error is null, it means the caller doesn't want to show any error on the input field -> the error div is disabled
      // if an ampty string is sent, the caller could need to show an error message. The error div is preallocated and made invisible with opacity: 0
      type: [String, null],
      default: null,
    },
  },
};
</script>
