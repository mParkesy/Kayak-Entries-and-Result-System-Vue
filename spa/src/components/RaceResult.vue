<template>
  <div id="RaceResult" class="col-lg-10 mx-auto pt-4">
    <h1> {{ this.racename }}</h1>
    <div v-for="result in race">
      <h2 style="text-align: left; font-size: 28px; font-weight: 600; padding-left: 20px;"> {{ result[0].raceDivision }} </h2>
      <table class="table table-bordered col-lg-12 mx-auto mt-2" >
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
          <th>{{ line.position }}</th>
          <th>{{ line.name }}</th>
          <th>{{ line.clubcode }}</th>
          <th>{{ line.class }}</th>
          <th>{{ line.division }}</th>
          <th>{{ line.time }}</th>
          <th>{{ line.points }}</th>
          <th>{{ line.pd }}</th>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';

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
        axios
          .get('http://localhost:8888/raceresult_order?id=' + this.$route.params.id)
          .then(response => {
            this.info = response.data.response;
            console.log(this.info);
            let divRace = [];
            let rd = "";
            for(let i = 0; i < this.info.length; i++){
              //console.log("Loop: " + i);
              if(this.info[i].raceDivision === rd){
                //.log("before and after same");
                divRace.push(this.info[i]);
              } else {
                //console.log("different");
                divRace = [];
                divRace.push(this.info[i]);
                this.race.push(divRace);
              }
              rd = this.info[i].raceDivision;
            }
          })
          .catch(e => {
            this.errors.push(e)
          }),
          axios
            .get('http://localhost:8888/race?id=' + this.$route.params.id)
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

</style>
