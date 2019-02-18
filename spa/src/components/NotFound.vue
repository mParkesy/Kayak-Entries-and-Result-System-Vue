<template>
  <header>
    <div class="masthead text-center text-white d-flex">
      <div class="container my-auto">
        <div class="row">
          <div class="col-lg-10 mx-auto">
            <h1 class="text-uppercase">
              <strong>#404 - Page Not Found</strong>
            </h1>
            <hr>
          </div>
          <div class="col-lg-8 mx-auto">
            <b-button size="lg" variant="primary" type="submit" v-bind:to="{ name: 'home'}">Home</b-button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
    export default {
        name: "NotFound"
    }
</script>

<style scoped>

</style>
