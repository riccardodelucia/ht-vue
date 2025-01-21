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

.footer-content {
  padding-block: var(--size-4);
  text-align: center;
  margin-bottom: var(--size-6);

  h2 {
    font-size: var(--font-size-6);
  }
}

.footer-link {
  text-decoration: none;
  color: white;

  &:hover {
    text-decoration: underline;
  }
}
</style>
