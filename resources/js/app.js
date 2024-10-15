import './bootstrap';
import { createApp } from 'vue';
import { createStore } from 'vuex';
import hello from './components/hello.vue';

// Create a new Vuex store
const store = createStore({
    state: {
        message: 'Hello from Vuex!',
    },
    mutations: {},
    actions: {},
});

// Create and mount the Vue app
createApp(hello)
    .use(store)
    .mount('#app');
