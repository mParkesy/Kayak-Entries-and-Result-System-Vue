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

.fade-enter-active, .fade-leave-active {
  transition-property: opacity;
  transition-duration: .25s;
}

.fade-enter-active {
  transition-delay: .25s;
}

.fade-enter, .fade-leave-active {
  opacity: 0
}


</style>
