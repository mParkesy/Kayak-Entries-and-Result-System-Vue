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
import RunRace from '../components/RunRace'
import {isOrganiser} from "../worker";
import Axios from "axios";
import Phone from "../components/Phone";
import RaceEntries from "../components/RaceEntries";
import AdminResult from "../components/AdminResult";
import ClubEntries from "../components/ClubEntries";

Vue.use(Router)

let router = new Router({
  mode: 'history',
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
      path: '/clubentries/:id/:club',
      name: 'clubentries',
      component: ClubEntries,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/runrace/:id',
      name: 'runrace',
      component: RunRace,
      meta: {
        requiresAuth: true,
        is_organiser: true
      }
    },
    {
      path: '/raceentries/:id/:name',
      name: 'raceentries',
      component: RaceEntries,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/adminresult/:id',
      name: 'adminresult',
      component: AdminResult,
    },
    {
      path: '/phoneresults/:id',
      name: 'phoneresults',
      component: Phone
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
    if (localStorage.getItem('jwt') === null) {
      this.$router.push('/');
    } else {
      let user = JSON.parse(localStorage.getItem('user'))
      let is_organiser = 0;

      Axios.post('http://192.168.0.47:3000/isorganiser', {
        userID : user.userID
      })
        .then(response => {
          is_organiser = response.data.response[0].account;
          console.log(is_organiser);
          if(to.matched.some(record => record.meta.is_organiser)) {
            if(is_organiser == 1 || is_organiser == 2){
              next()
            }
            else{
              this.$router.push('/teamleader');
            }
          }else {
            next()
          }
        })
        .catch(error => {
          console.log(error);
        })
    }
  } else {
    next()
  }
})

export default router
