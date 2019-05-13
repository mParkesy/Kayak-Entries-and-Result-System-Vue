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
  baseURL: 'http://localhost:3000'
})



/*Vue.http.interceptors.push({
  request: function (request){
    request.headers.authorization = localStorage.getItem('jwt');
    return request;
  },

  response: function (response) {
    console.log(response);
    return response;
  }
});*/

base.interceptors.request.use(
  reqConfig => {
    reqConfig.headers['Authorization'] = localStorage.getItem('jwt');

    return reqConfig;
  },
  err => Promise.reject(err),
);

base.interceptors.response.use(
  res => {
    console.log(res);
    if(res.data === "no token provided"){
      window.location = "/?message=d41d8cd98f00b204e9800998ecf8427e";
    } else {
      return res;
    }

  },
  err => Promise.reject(err),
);

Vue.prototype.$http = base;

/*base.interceptors.request.use(function (config) {
  let token = localStorage.getItem('jwt');
  if(token != null){
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});*/

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
