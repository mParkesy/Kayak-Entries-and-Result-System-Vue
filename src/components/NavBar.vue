<!--
  This is the navbar component that just contains some a Bootstrap navbar.
  It also checks to see if a user is logged in, a race organiser or a team leader and edits the menu options.
-->

<template>
  <b-navbar class="level" toggleable="lg" type="light" variant="light" top>
    <b-navbar-brand v-bind:to="'/'">HBRM <img src="../assets/img/canoe.svg" alt="Canoe" style="width: 25px; height: 25px;"/></b-navbar-brand>
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

    <b-collapse is-nav id="nav_collapse">


      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item v-bind:to="{ name: 'home'}">Home</b-nav-item>
          <b-nav-item v-bind:to="{ name: 'races'}">Races</b-nav-item>
        <b-nav-item v-bind:to="{ name: 'paddler'}">Paddler</b-nav-item>
        <b-nav-item v-if="normal" v-bind:to="{ name: 'login'}">Login</b-nav-item>
        <b-nav-item v-if="normal" v-bind:to="{ name: 'register'}">Register</b-nav-item>
        <b-nav-item v-if="organiser" v-bind:to="{ name: 'raceorganiser'}">Race Organiser</b-nav-item>
        <b-nav-item v-if="teamleader" v-bind:to="{ name: 'teamleader'}">Team Leader</b-nav-item>
        <b-nav-item v-if="teamleader || organiser" v-on:click="logout">Log Out</b-nav-item>
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
        // when the page is about to be loaded
        mounted () {
          let _this= this;
          // get user from local storage
          let user = JSON.parse(localStorage.getItem('user'));
          // get token
          let jwt = localStorage.getItem('jwt');
          // if token and user exist then check if organiser
          if(user != null && jwt != null){
            this.$http.post('/isorganiser', {
              userID : user.userID
            })
              .then(response => {
                let organiser_check = response.data.response[0];
                // set appropriate fields based on logged in or not and user role
                if(organiser_check.account == 1) {
                  _this.organiser = true;
                  _this.normal = false;
                } else if(organiser_check.account == 0) {
                  _this.teamleader = true;
                  _this.normal = false;
                } else if(organiser_check.account == 2) {
                  _this.teamleader = true;
                  _this.organiser = true;
                  _this.normal = false;                }
              })
              .catch(error => {
                console.log(error);
                _this.$swal("Error","Failed to authenticate user, you might need to login again", "error")
              })
          }
        },
        methods : {
          // log out function that removes from local storage and sets nav bar back to normal
          logout: function () {
            let _this= this;
            localStorage.removeItem("jwt");
            localStorage.removeItem("user");
            _this.teamleader = false;
            _this.organiser = false;
            _this.normal = true;
            this.$router.push('/');
          }
        }
    }
</script>

<style scoped>
  .level {
    z-index: 5;
  }
</style>
