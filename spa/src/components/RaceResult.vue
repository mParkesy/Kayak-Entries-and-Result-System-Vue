<template>
  <div id="raceresult">
    <b-container class="text-center mx-auto col-lg-10 mx-auto pt-4" style="overflow-x: scroll;">
      <b-row class="col-lg-12">
        <h1> {{ this.racename }}</h1>
      </b-row>
      <b-row v-for="result in race" :key="result.raceID" class="col-lg-12">
        <h2 style="text-align: left; font-size: 28px; font-weight: 600;"> Div {{ result[0].raceDivision }} </h2>
        <table class="table col-lg-12 mx-auto mt-2 results" v-bind:class="result[0].raceDivision.includes('_') ? ' k2Table ' : {} ">
          <thead class="thead-dark">
            <tr>
              <th scope="col">Position</th>
              <th scope="col">Name</th>
              <th scope="col">Club</th>
              <th scope="col">Class</th>
              <th scope="col">Div</th>
              <th scope="col">Time</th>
              <th scope="col">Points</th>
              <th scope="col">P/D</th>
            </tr>
          </thead>
            <tbody>
              <tr v-for="line in result">
                <td>{{ line.position }}</td>
                <td>{{ line.name }}</td>
                <td>{{ line.clubcode }}</td>
                <td>{{ line.class }}</td>
                <td>{{ line.division }}</td>
                <td>{{ line.time }}</td>
                <td>{{ line.points }}</td>
                <td>{{ line.pd }}</td>
              </tr>
            </tbody>
        </table>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import { sortRaces } from "../worker";

  export default {
      name: "RaceResult",
      data () {
        return {
          info: [],
          errors: [],
          race: [],
          racename: ""
        }
      },
      created() {
        this.$http
          .get('/raceresult_order?id=' + this.$route.params.id)
          .then(response => {
            this.info = response.data.response;
            console.log(this.info);
            this.race = sortRaces(this.info);
          })
          .catch(e => {
            this.errors.push(e)
          }),
          this.$http
            .get('/race?id=' + this.$route.params.id)
            .then(response => {
              let result = response.data.response;
              this.racename = result[0].raceName;
            })
            .catch(e => {
              this.errors.push(e)
            })
      }
    }
</script>

<style scoped>
  .k2Table tr:nth-child(4n + 3), .k2Table tr:nth-child(4n+4) {
    background: rgb(200, 200, 200);
  }

  #raceresult {
    background-color: rgb(228, 229, 231);
  }
</style>
