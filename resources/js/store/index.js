import axios from 'axios';
import * as XLSX from 'xlsx';

export default new Vuex.Store({
  state: {
    productTypes: [],
    gradeTypes: [],
    sizeTypes: [],
    connectionTypes: [],
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
  },
  actions: {
    async fetchXlsxData({ commit }) {
      try {
        const response = await axios.get('/files/data.xlsx', {
          responseType: 'arraybuffer', // Ensure the response is binary data
        });

        const data = new Uint8Array(response.data);
        const workbook = XLSX.read(data, { type: 'array' });

        // Assuming the data is in the first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert the sheet to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Extract relevant columns from the Excel data
        const productTypes = [];
        const gradeTypes = [];
        const sizeTypes = [];
        const connectionTypes = [];

        jsonData.forEach(row => {
          if (row[0]) productTypes.push({ name: row[0], quantity: row[1] });
          if (row[2]) gradeTypes.push({ name: row[2], quantity: row[3] });
          if (row[4]) sizeTypes.push({ name: row[4], quantity: row[5] });
          if (row[6]) connectionTypes.push({ name: row[6], quantity: row[7] });
        });

        commit('SET_PRODUCT_TYPES', productTypes);
        commit('SET_GRADE_TYPES', gradeTypes);
        commit('SET_SIZE_TYPES', sizeTypes);
        commit('SET_CONNECTION_TYPES', connectionTypes);

      } catch (error) {
        console.error("Error loading the Excel file:", error);
      }
    },
  },
});
