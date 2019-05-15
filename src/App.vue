<!--
  This is the main app component which includes the navbar and the definition for the router which allows
  parts of the page to change without the page loading again.
-->
<template>
  <div id="app">
    <NavBar></NavBar>
    <transition
      name="fade"
    >
    <router-view>

    </router-view>
    </transition>
  </div>
</template>

<script>

  import NavBar from "./components/NavBar";
  export default {
    name: 'App',
    components: {NavBar},
    data () {
      return {
      }
    }
  }
</script>

<style>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
