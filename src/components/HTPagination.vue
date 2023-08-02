<template>
  <nav class="pagination">
    <ul>
      <li class="ht-flex-align-center">
        <a v-if="currentPage > 1" class="ht-flex-align-center chevron"
          @click="emit('paginate', currentPage - 1)"><vue-feather type="chevron-left"></vue-feather></a>
        <a v-else class="ht-flex-align-center chevron" aria-disabled="true"><vue-feather
            type="chevron-left"></vue-feather></a>
      </li>

      <li v-for="page in pages" :key="page">
        <a class="page ht-number-indicator" :aria-current="page === currentPage ? 'page' : null"
          @click="emit('paginate', page)">{{ page }}</a>
      </li>
      <li class="ht-flex-align-center">
        <a v-if="currentPage < numberOfPages" class="ht-flex-align-center chevron"
          @click="emit('paginate', currentPage + 1)"><vue-feather type="chevron-right"></vue-feather></a>
        <a v-else class="ht-flex-align-center chevron" aria-disabled="true"><vue-feather
            type="chevron-right"></vue-feather></a>
      </li>
    </ul>
  </nav>
</template>

<script>
import { computed } from 'vue';

const arrayRange = (start, stop, step) =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
  );

export default {
  name: 'HTPagination',
  props: {
    numberOfPages: {
      type: Number,
      default: 20,
      validator(value) {
        return value > 0;
      },
    },
    currentPage: {
      type: Number,
      default: 1,
      validator(value) {
        return value > 0;
      },
    },
    displayedPages: {
      type: Number,
      default: 5,
      validator(value) {
        // must be a positive odd number
        return value > 0 && value % 2 === 1;
      },
    },
    routePath: {
      type: String,
      default: '/jobs',
    },
  },
  emits: { paginate: null },

  setup(props, { emit }) {
    const pages = computed(() => {
      // the window indicates the range of pages to be displayed (could be greater than the number of available pages)
      const windowMiddlePoint = Math.ceil(props.displayedPages / 2); // middle point in the window, use to decide how to shift the window among the available pages

      const windowRightHalf = props.displayedPages - windowMiddlePoint; // right part of the window, from windowMiddlePoint to end
      const windowLeftHalf = windowMiddlePoint - 1; // left part of the window, from start to windowMiddlePoint excluded

      const K = props.numberOfPages - windowRightHalf; // for lack of a better name. This stores the pages belonging to the right part of the window, when using the last window (i.e. the very last pages of the list)

      const WStart = arrayRange(1, props.displayedPages, 1); // first window, spanning from the first page until window length
      const WEnd = arrayRange(
        props.numberOfPages - props.displayedPages + 1,
        props.numberOfPages,
        1
      );

      // Algorithm
      if (props.numberOfPages <= props.displayedPages) {
        // show all pages
        return arrayRange(1, props.numberOfPages, 1);
      }
      // choose correct window
      if (props.currentPage <= windowMiddlePoint) {
        return WStart;
      }

      if (props.currentPage >= K) {
        return WEnd;
      }
      //sliding window, centere props.currentPage in windowMiddlePoint
      return arrayRange(
        props.currentPage - windowLeftHalf,
        props.currentPage + windowRightHalf,
        1
      );
    });

    return {
      pages,
      emit,
    };
  },
};
</script>

<style lang="postcss">
.pagination {
  ul {
    display: flex;
    align-items: space-between;
    list-style: none;
    gap: var(--size-3);
  }

  .page,
  .page:hover {
    text-decoration: none;
  }

  .chevron[aria-disabled='true'] {
    cursor: not-allowed;
    color: var(--ht-color-gray-1);
  }
}
</style>
