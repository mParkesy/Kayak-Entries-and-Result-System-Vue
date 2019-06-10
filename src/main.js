
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

// import all components for use
Vue.component("RaceResult", {

})

Vue.component("Races", {

})

Vue.component("Paddler", {

})

Vue.component("Login", {

})

import Axios from 'axios'

/**
 * Create an Axios instance for API calls and set the base URL
 * @type {AxiosInstance}
 */
const base = Axios.create({
  //baseURL: 'http://192.168.0.47:3000'
  baseURL: 'http://localhost:3000'
})

/**
 * Request interceptor to send jwt token in auth header
 */
base.interceptors.request.use(
  reqConfig => {
    reqConfig.headers['Authorization'] = localStorage.getItem('jwt');

    return reqConfig;
  },
  err => Promise.reject(err),
);

/**
 * Response interceptor to see if user has access to API
 */
base.interceptors.response.use(
  res => {
    if(res.data === "no token provided") {
      window.location = "/?message=d41d8cd98f00b204e9800998ecf8427e";
    }else if (res.data.status === 500){
      window.location = "/?message=84b42204e14f78f4216ac0d9f7fa1db0";
    } else {
      return res;
    }

  },
  err => Promise.reject(err),
);

// assign axios to vue reference http
Vue.prototype.$http = base;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
