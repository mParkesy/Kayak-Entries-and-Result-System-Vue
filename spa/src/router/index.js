import Vue from 'vue'
import Router from 'vue-router'
import App from '../App'
import RaceResult from "../components/RaceResult"
import Races from "../components/Races"
import Home from '../components/Home'
import Paddler from '../components/Paddler'
import Login from '../components/Login'
import Register from '../components/Register'
import TeamLeader from '../components/TeamLeader'
import RaceOrganiser from '../components/RaceOrganiser'
import NotFound from '../components/NotFound'
import {isOrganiser} from "../worker";
import Axios from "axios";

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
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
    {
      path: '/paddler',
      name: 'paddler',
      component: Paddler
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/teamleader',
      name: 'teamleader',
      component: TeamLeader,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/raceorganiser',
      name: 'raceorganiser',
      component: RaceOrganiser,
      meta: {
        requiresAuth: true,
        is_organiser: true
      }
    },
    {
      path: '/404',
      name: '404',
      component: NotFound
    },
    {
      path: '/*',
      name: 'redirect',
      redirect: '/404'
    }

  ]
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('jwt') == null) {
      next({
        path: '/login',
        params: { nextUrl: to.fullPath }
      })
    } else {
      let user = JSON.parse(localStorage.getItem('user'))
      let is_organiser = 0;

      Axios.post('http://localhost:3000/isorganiser', {
        userID : user.userID
      })
        .then(response => {
          is_organiser = response.data.response[0].organiser;
          console.log(is_organiser);
          if(to.matched.some(record => record.meta.is_organiser)) {
            if(is_organiser === 1){
              next()
            }
            else{
              next({ name: 'teamleader'})
            }
          }else {
            next()
          }
        })
        .catch(error => {
          return x;
        })
    }
  } else if(to.matched.some(record => record.meta.guest)) {
    if(localStorage.getItem('jwt') == null){
      next()
    }
  }else {
    next()
  }
})

export default router
