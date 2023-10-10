<template>
  <div class="swatches">
    <h2 class="ht-chart-title">{{ title }}</h2>
    <ul class="ht-reset">
      <li v-for="label in color.domain()" :key="label">
        <span
          :class="{ round: shape === 'round' }"
          :style="{ backgroundColor: color(label) }"
        ></span>
        <span>{{ label }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HTSwatches',
  props: {
    title: {
      type: String,
      default: '',
    },
    color: {
      type: Function,
      required: true,
    },
    shape: {
      type: String,
      default: 'square',
    },
  },
  setup() {
    return;
  },
};
</script>

<style lang="postcss" scoped>
.swatches {
  padding: var(--size-2);

  li {
    line-height: 1;
    span {
      vertical-align: text-bottom;
    }

    span:first-child {
      display: inline-block;
      margin-right: var(--size-2);
      width: 1rem;
      height: 1rem;
    }
  }

  .round {
    border-radius: 100%;
  }
}
</style>
