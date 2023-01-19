<template>
  <div class="layout-message">
    <h3>{{ title }}</h3>
    <p>{{ message }}</p>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'HTMessage',
  props: {
    title: { type: String, default: '' },
    message: { type: String, default: '' },
  },
};
</script>
