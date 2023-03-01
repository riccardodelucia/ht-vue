<template>
  <footer class="footer">
    <img :src="htLogoWhite" alt="HT logo" class="footer__logo" />

    Fondazione Human Technopole - Viale Rita Levi-Montalcini, 1 - Area MIND –
    Cargo 6 - 20157 Milano Italy - C.F. 97821360159
  </footer>
</template>

<script>
import htLogoWhite from '../assets/ht-logo-white.svg';

export default {
  name: 'HTFooter',
  data() {
    return {
      htLogoWhite,
    };
  },
};
</script>
