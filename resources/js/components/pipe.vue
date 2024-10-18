<template>
  <div>
    <h1>Dropdown</h1>
    
    <!-- filter -->
    <div class="filters">
      <label>Product Type:</label>
      <select v-model="selectedProductType" @change="filterData">
        <option value="">All</option>
        <option v-for="(type, index) in productTypes" :key="index" :value="type">
          {{ type }}
        </option>
      </select>

      <label>Size:</label>
      <select v-model="selectedSize" @change="filterData">
        <option value="">All</option>
        <option v-for="(size, index) in sizes" :key="index" :value="size">
          {{ size }}
        </option>
      </select>

      <label>Grade:</label>
      <select v-model="selectedGrade" @change="filterData">
        <option value="">All</option>
        <option v-for="(grade, index) in grades" :key="index" :value="grade">
          {{ grade }}
        </option>
      </select>

      <label>Connection:</label>
      <select v-model="selectedConnection" @change="filterData">
        <option value="">All</option>
        <option v-for="(connection, index) in connections" :key="index" :value="connection">
          {{ connection }}
        </option>
      </select>
    </div>

    <!-- table -->
    <table border="1" cellspacing="0" cellpadding="5">
      <thead>
        <tr>
          <th>Product Type</th>
          <th>Size</th>
          <th>Grade</th>
          <th>Connection</th>
          <th>Quantity</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filteredItems" :key="item.id">
          <td>{{ item['Product type'] }}</td>
          <td>{{ item.size }}</td>
          <td>{{ item.grade }}</td>
          <td>{{ item.connection }}</td>
          <td>{{ item.qty }} {{ item.qty_unit }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      products: [],  // data json

      // filter selections
      selectedProductType: "",
      selectedSize: "",
      selectedGrade: "",
      selectedConnection: "",

      // filtered data
      filteredItems: [],

      // filter options
      productTypes: [],
      sizes: [],
      grades: [],
      connections: [],
    };
  },

  methods: {
    // default dropdown
    initFilters() {
      this.filteredItems = this.products;
      this.productTypes = [...new Set(this.products.map((item) => item["Product type"]))];
      this.sizes = [...new Set(this.products.map((item) => item.size))];
      this.grades = [...new Set(this.products.map((item) => item.grade))];
      this.connections = [...new Set(this.products.map((item) => item.connection))];
    },

    // axios json
    async fetchData() {
      try {
        const response = await axios.get('/files/data.json');  
        this.products = response.data.Sheet1;
        this.initFilters();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },

    // filter dropdown
    filterData() {
      this.filteredItems = this.products.filter((item) => {
        const matchesProductType = this.selectedProductType
          ? item["Product type"] === this.selectedProductType
          : true;
        const matchesSize = this.selectedSize ? item.size === this.selectedSize : true;
        const matchesGrade = this.selectedGrade ? item.grade === this.selectedGrade : true;
        const matchesConnection = this.selectedConnection
          ? item.connection === this.selectedConnection
          : true;

        return matchesProductType && matchesSize && matchesGrade && matchesConnection;
      });
    },
  },

  mounted() {
    this.fetchData(); 
  },
};
</script>

<style scoped>
.filters {
  margin-bottom: 20px;
}

label {
  margin-right: 10px;
}

select {
  margin-right: 20px;
  padding: 5px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  text-align: left;
}
</style>
