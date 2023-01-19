<template>
  <header class="header">
    <div class="header__content" :style="[isWeb ? { maxWidth: '140rem' } : {}]">
      <a
        href="https://humantechnopole.it/en/"
        target="_blank"
        class="header__logo-link"
        ><img
          src="../assets/ht-logo-white.svg"
          alt="HT logo"
          class="header__logo"
      /></a>
      <slot name="logo"></slot>
      <nav class="header__nav">
        <slot name="nav"></slot>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: "HTHeader",
  props: {
    isWeb: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
