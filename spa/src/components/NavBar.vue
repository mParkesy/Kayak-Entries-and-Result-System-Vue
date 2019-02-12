<template>
  <b-navbar toggleable="md" type="dark" variant="info">

    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

    <b-navbar-brand v-bind:to="'/'" href="#">HBRM</b-navbar-brand>

    <b-collapse is-nav id="nav_collapse">


      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item v-bind:to="{ name: 'home'}">Home</b-nav-item>
          <b-nav-item v-bind:to="{ name: 'races'}">Races</b-nav-item>
        <b-nav-item v-bind:to="{ name: 'paddler'}">Paddler</b-nav-item>
        <b-nav-item v-bind:to="{ name: 'login'}">Login</b-nav-item>
        <b-nav-item v-bind:to="{ name: 'register'}">Register</b-nav-item>
      </b-navbar-nav>

    </b-collapse>
  </b-navbar>

  <!-- navbar-1.vue -->
</template>

<script>
    export default {
        name: "NavBar"
    }
</script>

<style scoped>

</style>


<!--<router-link v-bind:to="{ name: 'races'}"><a class="nav-item nav-link" href="#">Races</a></router-link>-->
