<template>
  <div id="teamleader" class=" mt-4">
    <b-container class="text-center mx-auto">
      <b-row class="col-lg-12 mx-auto mt-4">
        <h2 style="text-align: left; font-size: 28px; font-weight: 600;">Current Entries that are open</h2>
      </b-row>
      <b-row class="col-lg-12 mx-auto mt-4">
        <table class="table table-bordered">
          <thead class="thead-dark">
            <tr>
              <th scope="col">Race Name</th>
            </tr>
          </thead>
          <tbody>
          <tr v-for="">
            <th>
              <router-link :to="{}">
                <a>{{  }}</a>
              </router-link>
            </th>
            <th>{{  }}</th>
          </tr>
          </tbody>
        </table>
      </b-row>
    </b-container>
  </div>
</template>

<script>
    export default {
        name: "TeamLeader"
    }
</script>

<style scoped>

</style>
