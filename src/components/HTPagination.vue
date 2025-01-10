<template>
  <nav class="pagination-nav" aria-label="pagination">
    <ul class="pagination">
      <li>
        <button
          v-if="currentPage > 1"
          class="chevron"
          @click="paginate(currentPage - 1)"
        >
          <VueFeather type="chevron-left"></VueFeather>
        </button>
        <button v-else class="chevron" aria-disabled="true">
          <VueFeather type="chevron-left"></VueFeather>
        </button>
      </li>

      <li v-for="page in pages" :key="page">
        <button
          class="page number-indicator"
          :aria-current="page === currentPage ? 'page' : null"
          @click="paginate(page)"
        >
          {{ page }}
        </button>
      </li>
      <li>
        <button
          v-if="currentPage < numberOfPages"
          class="chevron"
          @click="paginate(currentPage + 1)"
        >
          <VueFeather type="chevron-right"></VueFeather>
        </button>
        <button v-else class="chevron" aria-disabled="true">
          <VueFeather type="chevron-right"></VueFeather>
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
/**
 * Note on accessibility: this component is not fully accessible. The nav element should contain anchor elements, where instead here we find buttons.
 * The reason is that this component actually doesn't navigate anywhere, but just manages the pagination logic. Such component therefore has a
 * non accessible nav, where internal elements do not navigate anywhere. Proper logic should be integrated to switch between buttons and anchors, in presence of
 * either provided links or a linkResolving function which extrapolates the link for each page.
 *
 */
import { computed } from 'vue';
import VueFeather from 'vue-feather';

const props = defineProps({
  numberOfPages: {
    type: Number,
    default: 20,
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
});

const emit = defineEmits(['paginate']);

const currentPage = defineModel('page', { type: Number, required: true });

const paginate = (page) => {
  currentPage.value = page;
};

const arrayRange = (start, stop, step) =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step,
  );

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
    1,
  );

  // Algorithm
  if (props.numberOfPages <= props.displayedPages) {
    // show all pages
    return arrayRange(1, props.numberOfPages, 1);
  }
  // choose correct window
  if (currentPage.value <= windowMiddlePoint) {
    return WStart;
  }

  if (currentPage.value >= K) {
    return WEnd;
  }
  //sliding window, center currentPage.value in windowMiddlePoint
  return arrayRange(
    currentPage.value - windowLeftHalf,
    currentPage.value + windowRightHalf,
    1,
  );
});
</script>

<style lang="postcss">
.pagination-nav {
  width: max-content;
}
.pagination {
  padding: 0;
  margin: 0;
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  list-style: none;
  gap: var(--size-3);

  .page,
  .chevron {
    display: grid;
    place-items: center;
    text-decoration: none;
    -ms-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    background-color: transparent;
    border: none;
    padding: 0;
  }

  .chevron {
    color: var(--ht-color-primary);
  }

  .chevron[aria-disabled='true'] {
    cursor: not-allowed;
    color: var(--ht-color-gray-1);
  }

  .page {
    color: var(--ht-color-primary);
    border-radius: var(--radius-round);
    border: 1px solid var(--ht-color-primary);
    aspect-ratio: 1;
    width: 2.5em;
  }

  .page[aria-current='page'] {
    background-color: var(--ht-color-primary);
    color: white;
  }
}
</style>
