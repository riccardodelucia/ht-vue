<template>
  <div class="datatable">
    <HTSearchBar
      class="datatable__search"
      label="Datatable Search"
      :model-value="search"
      @update:model-value="setSearch"
      @submit="onSubmit"
    ></HTSearchBar>
    <div class="datatable__select">
      <HTSelect
        v-model="pageSize"
        style="width: 6rem"
        :options="[
          { label: '5', value: 5 },
          { label: '10', value: 10 },
          { label: '20', value: 20 },
        ]"
      ></HTSelect>
    </div>

    <table>
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="column.name"
            :class="
              sortable(column)
                ? currentSortKey === column.name
                  ? sortOrders[column.name] > 0
                    ? 'sorting-asc'
                    : 'sorting-desc'
                  : 'sorting'
                : ''
            "
            :style="'width:' + column.width"
            @click="sortable(column) && sortBy(column.name)"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <slot
          v-for="(row, index) in paginatedItems"
          :key="index"
          :row="row"
        ></slot>
      </tbody>
    </table>
    <HTPagination
      class="datatable__pagination"
      :current-page="currentPage"
      :number-of-pages="numberOfPages"
      @paginate="setCurrentPage"
    >
    </HTPagination>
  </div>
</template>

<script>
import { reactive, ref, watch, computed } from 'vue';

import HTSearchBar from '@/components/HTSearchBar.vue';
import HTSelect from '@/components/HTSelect.vue';
import HTPagination from '@/components/HTPagination.vue';

const search = ref('');
const currentPage = ref(1);
const pageSize = ref(5);

const setSearch = (value) => {
  resetPagination();
  search.value = value;
};

const setCurrentPage = (value) => {
  currentPage.value = value;
};

const resetPagination = () => {
  currentPage.value = 1;
};

const paginate = (items, pageSize, currentPage) => {
  const stopIndex = Math.min(currentPage * pageSize, items.length);
  return items.slice((currentPage - 1) * pageSize, stopIndex);
};

const sortable = (item) => {
  return item?.isSortable ?? true;
};

const filterOnSearch = (rows) => {
  return rows.filter((row) => {
    return Object.keys(row).some((key) => {
      return (
        String(row[key]).toLowerCase().indexOf(search.value.toLowerCase()) > -1
      );
    });
  });
};

const sortData = (data, columns, currentSortKey, order) => {
  const getIndex = (array, key, value) => {
    return array.findIndex((i) => i[key] === value);
  };

  return data.slice().sort((a, b) => {
    const dataColumnIndex = getIndex(columns, 'name', currentSortKey);

    const valueA = a[currentSortKey];
    const valueB = b[currentSortKey];

    switch (columns[dataColumnIndex]?.type) {
      case 'date': {
        const dateA = new Date(valueA);
        const dateB = new Date(valueB);
        return (dateB.getTime() - dateA.getTime()) * order;
      }
      case 'number': {
        return (+valueB - +valueA) * order;
      }

      case 'string': {
        const stringA = String(valueA).toLowerCase();
        const stringB = String(valueB).toLowerCase();

        return (stringA === stringB ? 0 : stringA > stringB ? 1 : -1) * order;
      }

      default:
        return 0;
    }
  });
};

export default {
  name: 'HTDatatable',
  components: { HTSearchBar, HTSelect, HTPagination },
  props: {
    columns: { type: Array, default: () => [] },
    rows: { type: Array, default: () => [] },
  },
  setup(props) {
    const currentSortKey = ref(
      props.columns.find((column) => {
        sortable(column);
      })?.name || '',
    );

    const sortOrders = reactive(
      props.columns.reduce((acc, column) => {
        acc[column.name] = -1;
        return acc;
      }, {}),
    );

    const sortBy = (key) => {
      resetPagination();
      currentSortKey.value = key;
      sortOrders[key] = sortOrders[key] * -1;
    };

    watch(pageSize, () => {
      resetPagination();
    });

    const filteredItems = computed(() => {
      let rowsNew = props.rows;

      if (search.value) {
        rowsNew = filterOnSearch(props.rows);
      }

      if (currentSortKey.value) {
        const order = sortOrders[currentSortKey.value] || 1;
        rowsNew = sortData(rowsNew, props.columns, currentSortKey.value, order);
      }
      return rowsNew;
    });

    const filteredItemsTotal = computed(() => {
      return filteredItems.value.length;
    });
    const numberOfPages = computed(() => {
      return Math.ceil(filteredItemsTotal.value / pageSize.value);
    });
    const paginatedItems = computed(() => {
      return paginate(filteredItems.value, pageSize.value, currentPage.value);
    });

    return {
      sortable,
      sortBy,
      setSearch,
      setCurrentPage,
      resetPagination,
      sortOrders,
      currentSortKey,
      pageSize,
      currentPage,
      search,
      filteredItemsTotal,
      numberOfPages,
      paginatedItems,
    };
  },
};
</script>

<style lang="postcss" scoped>
.datatable {
  display: grid;
  grid-template-columns: repeat(2, 1fr);

  grid-row-gap: var(--size-5);

  grid-template-areas:
    'search select'
    'table table'
    '. pagination';

  &__search {
    grid-area: search;
  }

  &__select {
    grid-area: select;
    justify-self: end;
  }

  &__pagination {
    grid-area: pagination;
    justify-self: end;
  }

  table {
    grid-area: table;
    table-layout: fixed;

    border-collapse: collapse;

    .sorting,
    .sorting-asc,
    .sorting-desc {
      padding-right: 18px;
      position: relative;
    }

    .sorting:before,
    .sorting:after,
    .sorting-asc:before,
    .sorting-asc:after,
    .sorting-desc:before,
    .sorting-desc:after {
      border: 4px solid transparent;
      content: '';
      display: block;
      height: 0;
      right: 5px;
      top: 50%;
      position: absolute;
      width: 0;
    }

    .sorting:before {
      border-bottom-color: var(--ht-color-gray-3);
      margin-top: -9px;
    }

    .sorting:after {
      border-top-color: var(--ht-color-gray-3);
      margin-top: 1px;
    }

    .sorting-asc:before {
      border-bottom-color: var(--ht-color-gray-3);
      margin-top: -9px;
    }

    .sorting-desc:after {
      border-top-color: var(--ht-color-gray-3);
      margin-top: 1px;
    }

    :slotted(td),
    th {
      text-align: left;
      padding: var(--size-2) var(--size-3);
      text-overflow: ellipsis;
      overflow: hidden;
    }

    :slotted(tr:nth-child(odd)) {
      background-color: var(--ht-surface-3);
    }

    :slotted(tr:nth-child(even)) {
      background-color: var(--ht-surface-2);
    }
  }
}
</style>
