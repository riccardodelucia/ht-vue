<template>
  <div class="layout-web">
    <div class="layout-web__header">
      <slot name="header"></slot>
    </div>
    <div class="layout-web__content">
      <slot></slot>
    </div>
    <div class="layout-web__footer">
      <ht-footer></ht-footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HTWebLayout',
};
</script>
