<template>
  <footer class="footer">
    <img :src="imgUrl" alt="HT logo" class="footer__logo" />
    <div class="footer__address">
      Fondazione Human Technopole - Viale Rita Levi-Montalcini, 1 - Area MIND –
      Cargo 6 - 20157 Milano Italy - C.F. 97821360159
    </div>
  </footer>
</template>

<script>
export default {
  name: "HTFooter",
  data() {
    return {
      imgUrl: new URL("../assets/ht-logo-white.svg", import.meta.url).href,
    };
  },
};
</script>
