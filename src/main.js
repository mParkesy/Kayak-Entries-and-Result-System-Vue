// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import BootstrapVue from 'bootstrap-vue'

Vue.use(BootstrapVue);
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/css/style.css';

import VueSweetAlert from 'vue-sweetalert'
Vue.use(VueSweetAlert);

Vue.component("RaceResult", {

})

Vue.component("Races", {

})

Vue.component("Paddler", {

})

Vue.component("Login", {

})

import Axios from 'axios'


const base = Axios.create({
  baseURL: 'http://192.168.0.14:3000'
})

Vue.prototype.$http = base;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
