<template>
  <div class="container">
    <ht-header>
      <slot name="header"></slot>
    </ht-header>
    <main>
      <slot name="default"></slot>
    </main>
    <ht-footer>
      <slot name="footer"></slot>
    </ht-footer>
  </div>
</template>

<script setup></script>

<style lang="postcss" scoped>
.container {
  display: grid;
  min-height: 100vh;
  min-height: 100dvh;
  grid-template-rows: auto 1fr auto;
}
</style>
