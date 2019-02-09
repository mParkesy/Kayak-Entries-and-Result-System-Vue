import Vue from 'vue'
import Router from 'vue-router'
import App from '../App'
import RaceResult from "../components/RaceResult";
import Races from "../components/Races";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'App',
      component: App
    },
    {
      path: '/races',
      name: 'races',
      component: Races
    },
    {
      path: '/raceresult/:id',
      name: 'raceresult',
      component: RaceResult
    },

  ]
})
