import Vue from 'vue';
import { createApp } from 'vue';
import store from './store';
import InventorySearch from './components/pipe.vue'; 
import SimpleDropdown  from './components/hello.vue';

// Create and mount the Vue app
// createApp(InventorySearch)
//   .use(store)
//   .mount('#app');

createApp({
  components: {
    SimpleDropdown 
  },
  data() {
    return {
      dropdownOptions: ["Option 1", "Option 2", "Option 3"],
    };
  },
  template: `
    <div>
      <h1>Vue 3 Dropdown Example</h1>
      <SimpleDropdown :options="dropdownOptions" label="Choose an option:" />
    </div>
  `,
}).mount('#app');