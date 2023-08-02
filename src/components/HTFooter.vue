<template>
  <footer class="footer">
    <slot></slot>
    <section>
      <img :src="htLogoWhite" alt="HT logo" />
      <address>
        Fondazione Human Technopole - Viale Rita Levi-Montalcini, 1 - Area MIND
        – Cargo 6 - 20157 Milano Italy - C.F. 97821360159
      </address>
    </section>
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

<style lang="postcss" scoped>
.footer {
  background-color: var(--ht-color-brand-blue-2);
  color: white;
  padding: var(--size-3);

  section:last-child {
    display: grid;
    place-items: center;

    grid-row-gap: var(--size-4);

    img {
      width: 15rem;
    }
  }
}
</style>
