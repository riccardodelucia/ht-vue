<script>
import { h, ref, computed } from 'vue';
import VueFeather from 'vue-feather';

import { resizeListener } from './composables.js';

export default {
  name: 'HTPagination',
  props: {
    numberOfPages: {
      type: Number,
      default: 20,
      validator(value) {
        return value >= 0;
      },
    },
    currentPage: {
      type: Number,
      default: 7,
      validator(value) {
        return value >= 0;
      },
    },
  },
  emits: { paginate: null },

  setup(props) {
    const isMobile = ref(false);
    const delta = 5;

    resizeListener(() => (isMobile.value = window.innerWidth < 500));

    const pagination = computed(() => {
      const paginationData = {
        prevPage: props.currentPage > 0,
        nextPage: props.currentPage < props.numberOfPages - 1,
        pages: [],
      };

      if (props.numberOfPages <= delta) {
        paginationData.pages = Array.from(Array(props.numberOfPages).keys());
      } else {
        const startArray = Array.from(Array(delta - 1).keys());

        const endArray = Array.from(Array(props.numberOfPages).keys()).slice(
          -delta + 1
        );

        const deltaArray = Array.from(Array(props.numberOfPages).keys()).slice(
          props.currentPage - Math.floor(delta / 2),
          props.currentPage + Math.ceil(delta / 2)
        );

        // compose array
        let pages = [];
        if (props.currentPage < delta - 1) {
          pages = startArray;
          pages.push('...');
          pages.push(props.numberOfPages - 1);
        } else if (props.currentPage > props.numberOfPages - delta + 1) {
          pages = endArray;
          pages.unshift('...');
          pages.unshift(0);
        } else {
          pages = deltaArray;
          pages.unshift('...');
          pages.unshift(0);
          pages.push('...');
          pages.push(props.numberOfPages - 1);
        }

        paginationData.pages = pages;
      }

      return paginationData;
    });

    return {
      isMobile,
      delta,
      pagination,
    };
  },
  render() {
    const children = [];

    children.push(
      h(VueFeather, {
        type: 'chevron-left',
        class: [
          'pagination__navigation',
          this.pagination.prevPage ? '' : 'pagination--disabled',
        ],
        ...(this.pagination.prevPage && {
          onClick: () => {
            this.$emit('paginate', this.currentPage - 1);
          },
        }),
      })
    );

    if (!this.isMobile) {
      this.pagination.pages.forEach((page) => {
        if (!isNaN(page)) {
          children.push(
            h(
              'div',
              {
                class: [
                  'pagination__page',
                  page === this.currentPage ? 'pagination__page--selected' : '',
                ],
                onClick: () => {
                  this.$emit('paginate', page);
                },
              },
              [h('text', page + 1)]
            )
          );
        } else {
          children.push(h('span', page));
        }
      });
    } else {
      children.push(
        h(
          'div',
          {
            class: ['pagination__page', 'pagination__page--selected'],
          },
          [h('span', this.currentPage + 1)]
        )
      );
    }

    children.push(
      h(VueFeather, {
        type: 'chevron-right',
        class: [
          'pagination__navigation',
          this.pagination.nextPage ? '' : 'pagination--disabled',
        ],
        ...(this.pagination.nextPage && {
          onClick: () => {
            this.$emit('paginate', this.currentPage + 1);
          },
        }),
      })
    );

    return h('div', { class: 'pagination' }, children);
  },
};
</script>

<style lang="scss" scoped></style>
