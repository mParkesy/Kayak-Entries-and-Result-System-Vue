<template>
  <b-navbar toggleable="md" type="light" variant="light" top>

    <b-navbar-toggle target="nav_collapse" ></b-navbar-toggle>

    <b-navbar-brand v-bind:to="'/'">HBRM <img src="../assets/img/canoe.svg" alt="Canoe" style="width: 30px; height: 30px;"/></b-navbar-brand>

    <b-collapse is-nav id="nav_collapse" >


      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item v-bind:to="{ name: 'home'}">Home</b-nav-item>
          <b-nav-item v-bind:to="{ name: 'races'}">Races</b-nav-item>
        <b-nav-item v-bind:to="{ name: 'paddler'}">Paddler</b-nav-item>
        <b-nav-item v-if="normal" v-bind:to="{ name: 'login'}">Login</b-nav-item>
        <b-nav-item v-if="normal" v-bind:to="{ name: 'register'}">Register</b-nav-item>
        <b-nav-item v-if="organiser" v-bind:to="{ name: 'raceorganiser'}">Race Organiser</b-nav-item>
        <b-nav-item v-if="teamleader" v-bind:to="{ name: 'raceorganiser'}">Race Organiser</b-nav-item>
      </b-navbar-nav>

    </b-collapse>
  </b-navbar>

  <!-- navbar-1.vue -->
</template>

<script>
    export default {
        name: "NavBar",
        data() {
          return {
            normal: true,
            teamleader: false,
            organiser: false,
          }
        },
        created () {
          let _this= this;
          let user = JSON.parse(localStorage.getItem('user'));
          let jwt = localStorage.getItem('jwt');
          if(user != null && jwt != null){
            this.$http.post('/isorganiser', {
              userID : user.userID
            })
              .then(response => {
                let organiser_check = response.data.response[0];
                console.log(organiser_check);
                if(organiser_check.organiser > 0) {
                  this.organiser = true;
                  this.normal = false;
                } else if(organiser_check.account == 0) {
                  this.teamleader = true;
                  this.normal = false;
                }
              })
              .catch(error => {
                _this.$swal("Error","Failed to authenticate user, you might need to login again", "error")
              })
          }
        }
    }
</script>

<style scoped>
</style>


<!--<router-link v-bind:to="{ name: 'races'}"><a class="nav-item nav-link" href="#">Races</a></router-link>-->
