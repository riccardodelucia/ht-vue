<template>
  <header class="header">
    <a
      href="https://humantechnopole.it/en/"
      target="_blank"
      class="header__logo-link"
      ><img :src="imgUrl" alt="HT logo" class="header__logo"
    /></a>
    <slot name="logo"></slot>
    <nav class="header__nav">
      <slot name="nav"></slot>
    </nav>
  </header>
</template>

<script>
export default {
  name: "HTHeader",
  data() {
    return {
      imgUrl: new URL("../assets/ht-logo-white.svg", import.meta.url).href,
    };
  },
};
</script>
