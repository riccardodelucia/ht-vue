<template>
  <div class="message-page ht-skin-brand-gradient ht-lightmode">
    <h2>Not found 🔍</h2>
    <p>The content you're looking for is not there.</p>
    <RouterLink :to="{ name }" class="ht-button"> Back to Home </RouterLink>
  </div>
</template>

<script setup>
defineProps({
  name: { type: String, default: '' },
});
</script>

<style lang="postcss" scoped>
.message-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: var(--size-3);
}
</style>
