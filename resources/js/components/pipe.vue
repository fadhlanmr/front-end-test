<template>
  <div class="inventory-search">
    <h1>Pipe Inventory Search</h1>
    <div class="filters">
      <div v-for="filter in filters" :key="filter.type">
        <label :for="filter.type">{{ filter.label }}</label>
        <select
          :id="filter.type"
          v-model="selectedFilters[filter.type]"
          @change="updateFilters(filter.type)"
        >
          <option value="">All</option>
          <option
            v-for="option in getFilteredOptions(filter.type)"
            :key="option.name"
            :value="option.name"
          >
            {{ option.name }} ({{ option.quantity }})
          </option>
        </select>
      </div>
      <button @click="searchInventory" :disabled="loading">Find</button>
    </div>

    <div v-if="loading" class="loading">Loading...</div>

    <div v-else class="results">
      <table>
        <thead>
          <tr>
            <th v-for="header in tableHeaders" :key="header">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in paginatedResults" :key="index">
            <td>{{ item.productType }}</td>
            <td>{{ item.gradeType }}</td>
            <td>{{ item.sizeType }}</td>
            <td>{{ item.connectionType }}</td>
            <td>{{ item.quantity }}</td>
          </tr>
        </tbody>
      </table>
      <div class="pagination" v-if="filteredResults.length > itemsPerPage">
        <button @click="loadMore" :disabled="loading || allItemsLoaded">Load More</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'InventorySearch',
  data() {
    return {
      selectedFilters: {
        productType: '',
        gradeType: '',
        sizeType: '',
        connectionType: '',
      },
      filters: [
        { type: 'productTypes', label: 'Product Type' },
        { type: 'gradeTypes', label: 'Grade Type' },
        { type: 'sizeTypes', label: 'Size (OD)' },
        { type: 'connectionTypes', label: 'Connection' },
      ],
      tableHeaders: ['Product Type', 'Grade Type', 'Size (OD)', 'Connection', 'Quantity'],
      itemsPerPage: 20,
      currentPage: 1,
    };
  },
  computed: {
    ...mapState(['productTypes', 'gradeTypes', 'sizeTypes', 'connectionTypes', 'filteredResults', 'loading']),
    ...mapGetters(['getFilteredOptions']),
    paginatedResults() {
      return this.filteredResults.slice(0, this.currentPage * this.itemsPerPage);
    },
    allItemsLoaded() {
      return this.paginatedResults.length >= this.filteredResults.length;
    },
  },
  methods: {
    ...mapActions(['fetchInventoryData', 'filterResults']),
    updateFilters(type) {
      const index = this.filters.findIndex(filter => filter.type === type);
      for (let i = index + 1; i < this.filters.length; i++) {
        this.selectedFilters[this.filters[i].type.slice(0, -1)] = '';
      }
      this.searchInventory();
    },
    getFilteredOptions(type) {
      return this.getFilteredOptions(type, this.selectedFilters);
    },
    searchInventory() {
      this.currentPage = 1;
      this.filterResults(this.selectedFilters);
    },
    loadMore() {
      this.currentPage++;
    },
  },
  created() {
    this.fetchInventoryData();
  },
};
</script>

<style scoped>
.inventory-search {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.loading {
  text-align: center;
  font-size: 18px;
  margin: 20px 0;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}
</style>