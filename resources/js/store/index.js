import {createStore} from 'vuex';
import axios from 'axios';
import * as XLSX from 'xlsx';

export default createStore({
  state: {
    productTypes: [],
    gradeTypes: [],
    sizeTypes: [],
    connectionTypes: [],
    filteredResults: [],
    loading: false,
  },
  mutations: {
    SET_PRODUCT_TYPES(state, payload) {
      state.productTypes = payload;
    },
    SET_GRADE_TYPES(state, payload) {
      state.gradeTypes = payload;
    },
    SET_SIZE_TYPES(state, payload) {
      state.sizeTypes = payload;
    },
    SET_CONNECTION_TYPES(state, payload) {
      state.connectionTypes = payload;
    },
    SET_FILTERED_RESULTS(state, payload) {
      state.filteredResults = payload;
    },
    SET_LOADING(state, payload) {
      state.loading = payload;
    },
  },
  actions: {
    async fetchInventoryData({ commit }) {
      try {
        commit('SET_LOADING', true);
        const response = await axios.get('/files/data.xlsx', {
          responseType: 'arraybuffer',
        });
        const data = new Uint8Array(response.data);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        console.log(jsonData)

        // Skip header row
        jsonData.shift();

        const productTypes = new Set();
        const gradeTypes = new Set();
        const sizeTypes = new Set();
        const connectionTypes = new Set();

        jsonData.forEach(row => {
          productTypes.add(row[0]);
          gradeTypes.add(row[1]);
          sizeTypes.add(row[2]);
          connectionTypes.add(row[3]);
        });

        commit('SET_PRODUCT_TYPES', Array.from(productTypes).map(type => ({ name: type, quantity: countOccurrences(jsonData, 0, type) })));
        commit('SET_GRADE_TYPES', Array.from(gradeTypes).map(type => ({ name: type, quantity: countOccurrences(jsonData, 1, type) })));
        commit('SET_SIZE_TYPES', Array.from(sizeTypes).map(type => ({ name: type, quantity: countOccurrences(jsonData, 2, type) })));
        commit('SET_CONNECTION_TYPES', Array.from(connectionTypes).map(type => ({ name: type, quantity: countOccurrences(jsonData, 3, type) })));
        
        commit('SET_FILTERED_RESULTS', jsonData.map(row => ({
          productType: row[0],
          gradeType: row[1],
          sizeType: row[2],
          connectionType: row[3],
          quantity: row[4],
        })));
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    filterResults({ commit, state }, filters) {
      const filteredResults = state.filteredResults.filter(item => {
        return (!filters.productType || item.productType === filters.productType) &&
               (!filters.gradeType || item.gradeType === filters.gradeType) &&
               (!filters.sizeType || item.sizeType === filters.sizeType) &&
               (!filters.connectionType || item.connectionType === filters.connectionType);
      });
      commit('SET_FILTERED_RESULTS', filteredResults);
    },
  },
  getters: {
    getFilteredOptions: (state) => (type, selectedFilters) => {
      let filteredOptions = state[type];
      
      if (selectedFilters.productType && type !== 'productTypes') {
        filteredOptions = filteredOptions.filter(item => 
          state.filteredResults.some(result => 
            result.productType === selectedFilters.productType && 
            result[type.slice(0, -1)] === item.name
          )
        );
      }
      if (selectedFilters.gradeType && type !== 'gradeTypes' && type !== 'productTypes') {
        filteredOptions = filteredOptions.filter(item => 
          state.filteredResults.some(result => 
            result.gradeType === selectedFilters.gradeType && 
            result[type.slice(0, -1)] === item.name
          )
        );
      }
      if (selectedFilters.sizeType && type === 'connectionTypes') {
        filteredOptions = filteredOptions.filter(item => 
          state.filteredResults.some(result => 
            result.sizeType === selectedFilters.sizeType && 
            result.connectionType === item.name
          )
        );
      }
      
      return filteredOptions;
    },
  },
});

function countOccurrences(data, columnIndex, value) {
  return data.reduce((count, row) => row[columnIndex] === value ? count + parseInt(row[4], 10) : count, 0);
}