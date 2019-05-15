<!--
  Shows the results from a particular race division by division.
-->

<template>
  <div id="raceresult">
    <b-container v-if="canView" class="text-center mx-auto col-lg-10 pt-2 scrollX">
      <b-row class="col-lg-12">
        <h1> {{ racename }}</h1>
      </b-row>
      <b-row v-for="result in race" :key="result.raceID" class="col-lg-12">
        <h2 class="title" v-if="result[0].raceDivision.includes('Div')">{{ result[0].raceDivision }} </h2>
        <h2 class="title" v-if="result[0].raceDivision.includes('U')">{{ result[0].raceDivision }} </h2>
        <h2 class="title" v-if="!(result[0].raceDivision.includes('Div')) && !(result[0].raceDivision.includes('U'))">Div {{ result[0].raceDivision }} </h2>
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
      <h2 class="title">Club Points</h2>
      <table class="table col-lg-12 mx-auto mt-2 results">
        <thead class="thead-dark">
        <tr>
          <th scope="col">Position</th>
          <th scope="col">Club</th>
          <th scope="col">Points</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(club, index) in clubpoints">
          <td>
            {{ index + 1 }}
          </td>
          <td>
            {{ club.clubname }}
          </td>
          <td>
            {{ club.points }}
          </td>
        </tr>
        </tbody>
      </table>
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
          racename: "",
          canView : false,
          clubpoints : []
        }
      },
      created() {
        let _this = this;
        // gets the result for the race
        _this.$http
          .get('/raceresult_order?id=' + _this.$route.params.id)
          .then(response => {
            _this.info = response.data.response;
            if(_this.info.length === 0){
              _this.$swal("Error", "There are no results for that race", "error")
                .then(() => {
                  window.location = "/races";
                })
            } else {
              _this.canView = true;
            }
            // sorts the results in divisions for displaying
            _this.race = sortRaces(_this.info);
          })
          .catch(e => {
            console.log(e)
            _this.$swal("Race result error", "Please reload the page", "error");
            _this.errors.push(e)
          }),
          // gets the races detals
          _this.$http
            .get('/race?id=' + _this.$route.params.id)
            .then(response => {
              let result = response.data.response;
              _this.racename = result[0].raceName;
            })
            .catch(e => {
              console.log(e)
              _this.$swal("Race result error", "Please reload the page", "error");
              _this.errors.push(e)
            })

        _this.$http
          .post('/clubpointsforrace', {
            raceID : _this.$route.params.id
          })
          .then(response => {
            _this.clubpoints = response.data.response;
            _this.clubpoints.sort(function (a, b) {
              return parseInt(b.points) - parseInt(a.points);
            })
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
    height: 100%;
  }


  @media only screen and (max-width: 730px) {
    .scrollX {
      overflow-x: scroll;
    }
  }

  .title {
    text-align: left;
    font-size: 28px;
    font-weight: 600;
  }
</style>
