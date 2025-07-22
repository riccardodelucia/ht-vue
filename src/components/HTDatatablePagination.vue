<template>
  <div class="pagination">
    <div class="page-size-select">
      <ht-select
        :modelValue="pageSize"
        :options="[5, 10, 20, 30]"
        @update:modelValue="emit('page-size', $event)"
        label="Page Size"
      ></ht-select>
    </div>
    <div class="pagination-controls">
      <span v-if="totalItemsCount">Total count: {{ totalItemsCount }}</span>
      <span>Page {{ currentPage }} of {{ availablePages }}</span>
      <nav class="pagination-nav" aria-label="pagination">
        <ul>
          <li>
            <button
              v-if="currentPage > 1"
              class="chevron"
              @click="setCurrentPage(currentPage - 1)"
            >
              <VueFeather type="chevron-left"/>
            </button>
            <button v-else class="chevron" aria-disabled="true">
              <VueFeather type="chevron-left"/>
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
              v-if="currentPage < availablePages"
              class="chevron"
              @click="setCurrentPage(currentPage + 1)"
            >
              <VueFeather type="chevron-right"/>
            </button>
            <button v-else class="chevron" aria-disabled="true">
              <VueFeather type="chevron-right"/>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
/**
 * Note on accessibility: this component is not fully accessible. The nav element should contain anchor elements, where instead here we find buttons.
 * The reason is that this component actually doesn't navigate anywhere, but just manages the pagination logic. Such component therefore has a
 * non accessible nav, where internal elements do not navigate anywhere. Proper logic should be integrated to switch between buttons and anchors, in presence of
 * either provided links or a linkResolving function which extrapolates the link for each page.
 */
import { computed, ref } from 'vue';

const props = defineProps({
  // max number of pages to be displayed
  displayablePages: {
    type: Number,
    default: 5,
    validator(value) {
      return value > 0 && value % 2 === 1;
    },
  },
  // total number of pages according to the size of data
  availablePages: {
    type: Number,
    default: 1,
    validator(value) {
      return value > 0;
    },
  },
  totalItemsCount: { type: Number, default: null },
});

/**
 * This component defines a model to update the page. Getting the page to be shown by a props is more robust than setting up the page in the component, starting from 1.
 * This is especially true when server side pagination is used. Since the server request for the page could fail, we need a way to tell the pagination component to change the page to the fallback page
 * designated after the server query has failed.
 * If the page is not passed as a props, this would be impossible, and we risk to misalign the data of the current page with the current page indicated by the pagination component.
 * Note: since we use defineModel, an internal ref is created which is used to modify the page and implicitly emit the event. This is just a byproduct of the usage of defineModel, and the page must be enforced by the props value.
 */
const currentPage = defineModel('page', { type: Number, required: true });

const setCurrentPage = (page) => {
  currentPage.value = page;
};

const emit = defineEmits(['page-size']);

const pageSize = ref(5);

///////////////////////////////////////////
// pagination render algorithm

// creates an array of integers of length (stop - start) / step + 1, starting from start index and up to the stop index
// e.g: arrayRange(18, 20, 1) >> [18, 19, 20]
const arrayRange = (start, stop, step) =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (value, idx) => start + idx * step,
  );

const pages = computed(() => {
  const pageWindowLength = props.displayablePages; // number of pages to display (it could be greater than the available pages)
  const windowCentralIdx = Math.ceil(pageWindowLength / 2); // index of middle point in the window. Note: the window must be an odd number value
  const halfWindowSpan = (pageWindowLength - 1) / 2; // number of page elements for each side of the window, from the central index

  const K = props.availablePages - halfWindowSpan; // for lack of a better name. This stores the pages belonging to the right part of the window, when using the last window (i.e. the very last pages of the list)

  // Algorithm for choosing the window
  if (props.availablePages <= pageWindowLength) {
    // the available number of pages is lower than the pages to be displayed -> show only available pages
    return arrayRange(1, props.availablePages, 1);
  }

  if (currentPage.value <= windowCentralIdx) {
    return arrayRange(1, pageWindowLength, 1); // first window, spanning from the first page until window length
  }

  if (currentPage.value >= K) {
    // last window, spanning a window up to the last available page
    return arrayRange(
      props.availablePages - pageWindowLength + 1,
      props.availablePages,
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

<style lang="postcss" scoped>
.pagination-controls {
  display: flex;
  align-items: center;
  gap: var(--size-4);
}

.pagination {
  display: flex;
  align-items: center;
  gap: var(--size-4);
  justify-content: space-between;
}

.page-size-select {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: var(--size-4);
}

.page-size-select :deep(select) {
  width: 3.8rem;
}

.pagination-nav > ul {
  padding: 0;
  margin: 0;
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  list-style: none;
  gap: var(--size-3);
}
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
</style>
