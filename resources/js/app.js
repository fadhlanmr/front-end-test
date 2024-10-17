import Vue from 'vue';
import store from './store';
import pipe from './components/pipe.vue';
import hello from './components/hello.vue';

new Vue({
  store,
  render: h => h(hello),
}).$mount('#app');
