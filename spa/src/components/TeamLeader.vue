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
              <th scope="col">Race Entry Closes</th>
            </tr>
          </thead>
          <tbody>
          <tr v-for="race in races">
            <th>
              <router-link :to="{}">
                <a class="raceName" v-on:click="raceSelected(race.raceID)">{{ race.raceName }}</a>
              </router-link>
            </th>
            <th>
                {{ race.entryCloses.getDate() + "th " + months[race.entryCloses.getMonth()] + " at 10pm" }}
            </th>
          </tr>
          </tbody>
        </table>
      </b-row>
    </b-container>
  </div>
</template>

<script>
    export default {
      name: "TeamLeader",
      data () {
        return {
          races: [],
          errors: [],
          months: ["January", "February", "March", "April", "May", "June", "July", "August", "September",
            "October", "November", "December"],
          showRace: false,

        }
      },
      created() {
        let _this = this;
        let call = "/races?process=0";
        _this.$http
          .get(call)
          .then(response => {
            let races = response.data.response;
            console.log(races);
            for(let x = 0; x < races.length; x++){
              let parts = races[x].date.split("/");
              let race_date = new Date(parts[1] + "/" + parts[0] + "/" + parts[2]);
              let race_entry = new Date(race_date.setDate(race_date.getDate()-3));
              let current = new Date();
              race_entry.setHours(22);
              if(current < race_entry){
                _this.races.push({
                  raceName : races[x].raceName,
                  raceID : races[x].raceID,
                  regionID : races[x].regionID,
                  clubID : races[x].clubID,
                  processed : races[x].processed,
                  entryCloses : race_entry
                });
              }
            }
        })
        .catch(e => {
          _this.errors.push(e)
        })
      },
      methods : {
        raceSelected(id) {
          let _this = this;

          _this.showRace = true;
          console.log(id);
        }
      }
    }
</script>

<style scoped>

</style>
