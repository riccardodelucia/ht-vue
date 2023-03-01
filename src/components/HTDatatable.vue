<template>
  <div class="datatable">
    <div class="datatable__controls">
      <ht-search-bar
        :model-value="search"
        @update:model-value="setSearch"
      ></ht-search-bar>
      <ht-select
        v-model="pageSize"
        style="width: 6rem"
        :options="[5, 10, 20]"
      ></ht-select>
    </div>

    <table class="datatable__table table">
      <thead class="table__head">
        <tr>
          <th
            v-for="column in columns"
            :key="column.name"
            class="table__head-item"
            :class="
              sortable(column)
                ? currentSortKey === column.name
                  ? sortOrders[column.name] > 0
                    ? 'table__head-item--sorting-asc'
                    : 'table__head-item--sorting-desc'
                  : 'table__head-item--sorting'
                : ''
            "
            :style="'width:' + column.width"
            @click="sortable(column) && sortBy(column.name)"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody class="table__body">
        <slot
          v-for="(row, index) in paginatedItems"
          :key="index"
          :row="row"
        ></slot>
      </tbody>
    </table>
    <ht-pagination

      class="datatable__pagination margin-top"
      :current-page="currentPage"
      :number-of-pages="numberOfPages"
      @paginate="setCurrentPage"
    >
    </ht-pagination>
  </div>
</template>

<script>
import { reactive, ref, watch, computed } from 'vue';

const search = ref('');
const currentPage = ref(0);
const pageSize = ref(5);

const setSearch = (value) => {
  resetPagination();
  search.value = value;
};

const setCurrentPage = (value) => {
  currentPage.value = value;
};

const resetPagination = () => {
  currentPage.value = 0;
};

const paginate = (items, pageSize, currentPage) => {
  const stopIndex = Math.min((currentPage + 1) * pageSize, items.length);
  return items.slice(currentPage * pageSize, stopIndex);
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
  props: {
    columns: { type: Array, default: () => [] },
    rows: { type: Array, default: () => [] },
  },

  setup(props) {
    const currentSortKey = ref(
      props.columns.find((column) => {
        sortable(column);
      })?.name || ''
    );

    const sortOrders = reactive(
      props.columns.reduce((acc, column) => {
        acc[column.name] = -1;
        return acc;
      }, {})
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
