<template>

    <div id="races" class=" mt-4">
      <b-container class="text-light text-center mx-auto">
        <b-row>
          <b-col class="mx-2 bg-info year" v-for="year in years" :key="year.year" v-on:click="getRaces(year.year)">
            <a class="mx-auto">{{ year.year }}</a>
          </b-col>
        </b-row>
      </b-container>
        <table class="table table-bordered col-lg-8 mx-auto mt-4">
          <thead v-if="loading" class="thead-dark">
          <tr>
            <th scope="col">Race Name</th>
            <th scope="col">Year</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="race in info">
            <th>
              <router-link :to="{ name: 'raceresult', params: { id: race.raceID }}">
                <a>{{ race.raceName }}</a>
              </router-link>
            </th>
            <th>{{ race.year }}</th>
          </tr>
          </tbody>
        </table>
      </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'races',
    data () {
      return {
        info: [],
        errors: [],
        years: [],
        loading: false,
      }
    },
    methods : {
      getRaces: function (year) {
        axios
          .get('http://localhost:8888/races?year=' + year)
          .then(response => {
            this.loading = true;
            this.info = response.data.response;

          })
          .catch(e => {
            this.errors.push(e)
            this.loading = false;
          })
      }
    },
    created() {
      axios
          .get('http://localhost:8888/race_year')
          .then(response => {
            this.years = response.data.response;
            this.getRaces(this.years.slice(-1)[0].year)
          })
          .catch(e => {
            this.errors.push(e)
          })


    }
  }


</script>

<style scoped>
  .year {
    cursor: pointer;
  }

  hr {
    width: 1px;
  }
</style>
