<template>
  <div>
    <h1>Pipe Inventory Search</h1>
    <form @submit.prevent="searchPipes">
      <div>
        <label for="productType">Product Type</label>
        <select v-model="productType">
          <option v-for="option in productTypes" :key="option.id" :value="option">
            {{ option.name }} (Quantity: {{ option.quantity }})
          </option>
        </select>
      </div>
      
      <div>
        <label for="gradeType">Grade Type</label>
        <select v-model="gradeType">
          <option v-for="option in filteredGradeTypes" :key="option.id" :value="option">
            {{ option.name }} (Quantity: {{ option.quantity }})
          </option>
        </select>
      </div>

      <button type="submit">Find</button>
    </form>

    <!-- Display loading -->
    <div v-if="loading">Loading...</div>

    <!-- Data table -->
    <table v-if="results.length">
      <thead>
        <tr>
          <th>Product Type</th>
          <th>Grade</th>
          <th>Size</th>
          <th>Connection</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pipe in results" :key="pipe.id">
          <td>{{ pipe.productType }}</td>
          <td>{{ pipe.grade }}</td>
          <td>{{ pipe.size }}</td>
          <td>{{ pipe.connection }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      productType: null,
      gradeType: null,
    };
  },
  computed: {
    ...mapState(['productTypes', 'filteredGradeTypes', 'results', 'loading']),
  },
  methods: {
    ...mapActions(['fetchDropdownData', 'searchPipes', 'fetchXlsxData']),
  },
  mounted() {
    this.fetchDropdownData();
    this.fetchXlsxData();  // Fetch data on component mount
  },
};
</script>
