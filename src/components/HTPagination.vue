<template>
  <nav class="pagination-nav" aria-label="pagination">
    <ul class="pagination">
      <li>
        <button
          v-if="currentPage > 1"
          class="chevron"
          @click="setCurrentPage(currentPage - 1)"
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
          @click="setCurrentPage(page)"
        >
          {{ page }}
        </button>
      </li>
      <li>
        <button
          v-if="currentPage < numberOfPages"
          class="chevron"
          @click="setCurrentPage(currentPage + 1)"
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
import { computed, watchEffect } from 'vue';
import VueFeather from 'vue-feather';

const props = defineProps({
  server: { type: Boolean, default: false }, // server side pagination. Pagination logic is demanded to the server. The component only sends pagination events and shows the current active page
  numberOfDisplayedPages: {
    type: Number,
    default: 5,
    validator(value) {
      // must be a positive odd number
      return value > 0 && value % 2 === 1;
    },
  },
  // number of pages must be provided for server side pagination only to know the number of available pages
  numberOfPages: {
    type: Number,
    required: false,
    validator(value) {
      return value > 0;
    },
  },
  // knowing the data is mandatory for client side pagination to know the number of available pages
  data: {
    required: false,
    type: Array,
  },
});

// update:page event is alsow used for server side to communicate the selected page. The parent must then avoid v-model and register to @update:page event, and then make the API call to the server
const currentPage = defineModel('page', { type: Number, required: true });

const availablePages = ref(0);

watchEffect(() => {
  if (!props.server) {
    availablePages.value = props.numberOfPages;
  } else {
    availablePages.value =
      Math.ceil(props.data.length / props.numberOfPages) || 1;
  }
});

const setCurrentPage = (page) => {
  currentPage.value = page;

  if (!props.server) {
    // compute the start and stop indexes for data to be shown according to the selected page
    const startIndex = (currentPage.value - 1) * pageSize;
    const stopIndex = Math.min(startIndex, items.length);
    items.slice((currentPage - 1) * pageSize, stopIndex);
  }
};

///////////////////////////////////////////
// pagination render algorithm

// creates an array of integers of length (stop - start) / step + 1, starting from start index and up to the stop index
// e.g: arrayRange(18, 20, 1) >> [18, 19, 20]
const arrayRange = (start, stop, step) =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step,
  );

const pages = computed(() => {
  const pageWindowLength = props.numberOfDisplayedPages; // number of pages to display (it could be greater than the available pages)
  const windowCentralIdx = Math.ceil(pageWindowLength / 2); // index of middle point in the window. Note: the window must be an odd number value
  const halfWindowSpan = (pageWindowLength - 1) / 2; // number of page elements for each side of the window, from the central index

  const K = props.numberOfPages - halfWindowSpan; // for lack of a better name. This stores the pages belonging to the right part of the window, when using the last window (i.e. the very last pages of the list)

  // Algorithm for choosing the window
  if (props.numberOfPages <= pageWindowLength) {
    // the available number of pages is lower than the pages to be displayed -> show only available pages
    return arrayRange(1, props.numberOfPages, 1);
  }

  if (currentPage.value <= windowCentralIdx) {
    return arrayRange(1, pageWindowLength, 1); // first window, spanning from the first page until window length
  }

  if (currentPage.value >= K) {
    // last window, spanning a window up to the last available page
    return arrayRange(
      props.numberOfPages - pageWindowLength + 1,
      props.numberOfPages,
      1,
    );
  }
  //standard sliding window, where currentPage is centered
  return arrayRange(
    currentPage.value - halfWindowSpan,
    currentPage.value + halfWindowSpan,
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
