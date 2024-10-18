import { createApp } from 'vue';
import store from './store';
import InventorySearch from './components/pipe.vue'; 
import SimpleDropdown  from './components/hello.vue';

const app = createApp(InventorySearch);
// app.use(store);
app.mount('#app');
