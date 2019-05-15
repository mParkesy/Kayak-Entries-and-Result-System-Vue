<!--
  Team Leader component where the team leader sees a list of active races and can add a paddler to the system.
-->

<template>
  <div id="teamleader" class="pt-3">
    <b-container class="text-center">
      <b-row class="col-lg-12 mx-auto mt-4">
        <h2 class="title">Current Entries that are open</h2>
      </b-row>
      <b-row class="col-lg-12 mx-auto py-4 panel" style="background-color: white;">
        <table class="table table-bordered">
          <thead class="thead-dark">
          <tr>
            <th scope="col">Race Name</th>
            <th scope="col">Race Entry Closes</th>
            <th scope="col">Make Entries</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="race in races">
            <th>
              <router-link :to="{ name: 'raceentries', params: { id: race.raceID, name: race.raceName }}">
                <a class="raceName">{{ race.raceName }}</a>
              </router-link>
            </th>
            <th>
              {{ race.entryCloses.getDate() + "th " + months[race.entryCloses.getMonth()] + " at 10pm" }}
            </th>
            <th>
              <router-link :to="{ name: 'raceentries', params: { id: race.raceID, name: race.raceName }}">
                <a><i class="fas fa-sign-in-alt plus"></i></a>
              </router-link>
<!--              <router-link :to="{}">
                <a v-on:click="raceSelected(race.raceID, race.raceName)"><i class="fas fa-sign-in-alt plus"></i></a>
              </router-link>-->
            </th>
          </tr>
          </tbody>
        </table>
      </b-row>
      <b-row class="col-lg-14 mx-auto mt-4" align-h="center">
        <b-col class="panel py-4 mb-4" md="5" style="background-color: rgb(254, 193, 6);">
          <h2>Submit a new paddler</h2>
          <b-form class="form" @submit="handleSubmit">
            <b-form-group label="Paddler name: ">
              <b-form-input
                type="text"
                v-model="form.name"
                class="form-control"
                placeholder="Name"
                required
                autofocus />
            </b-form-group>
            <b-form-group label="Paddler BCU number: ">
              <b-form-input
                type="text"
                v-model="form.bcu"
                class="form-control"
                placeholder="BCU Number"
                maxlength="6"
                required
                autofocus />
            </b-form-group>
            <b-form-group label="Paddler starting division: ">
              <b-form-select class="form-control" v-model="form.division" :options="options"></b-form-select>
            </b-form-group>
            <b-form-group label="Paddler class: ">
              <b-form-select class="form-control" v-model="form.class" :options="classOptions"></b-form-select>
            </b-form-group>
            <b-button size="lg" variant="primary" block type="submit">Submit</b-button>
          </b-form>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  // Import component
  import Loading from 'vue-loading-overlay';
  // Import stylesheet
  import 'vue-loading-overlay/dist/vue-loading.css';

  export default {
    name: "TeamLeader",
    data () {
      return {
        form: {
          name: "",
          division: "",
          class : "",
          bcu : ""
        },
        options: [],
        classOptions : [
          { value : 'SMK', text : 'SMK' },
          { value : 'VMK', text : 'VMK' },
          { value : 'JMK', text : 'JMK' },
          { value : 'SFK', text : 'SFK' },
          { value : 'JFK', text : 'JFK' },
          { value : 'VFK', text : 'VFK' },
          { value : 'VMC', text : 'VMC' },
          { value : 'SFC', text : 'SFC' },
          { value : 'JFC', text : 'JFC' },
          { value : 'SMC', text : 'SMC' },
          { value : 'VFC', text : 'VFC' },
          { value : 'JMC', text : 'JMC' }
        ],
        races: [],
        errors: [],
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September",
          "October", "November", "December"],
        fullPage : true,
      }
    },
    components: {
      Loading
    },
    created() {
      let _this = this;
      let call = "/races?process=0";
      // get all races with race process of 0
      _this.$http
        .get(call)
        .then(response => {
          let races = response.data.response;
          // loop over race list
          for(let x = 0; x < races.length; x++){
            // split date up and build new date and make into JavaScript data object
            let parts = races[x].date.split("/");
            let race_date = new Date(parts[1] + "/" + parts[0] + "/" + parts[2]);
            let race_entry = new Date(race_date.setDate(race_date.getDate()-3));
            let current = new Date();
            race_entry.setHours(22);
            // check if entries are live for the race and if so add to life race list
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
          _this.$swal("There was an error", "There was an error loading the races for entry, please try again.", "error");
          console.log(e);
        })
      // get a list of distinct race divisions in the whole system
      _this.$http
        .get('/distinctdivisions')
        .then(response => {
          let result = response.data.response;
          // loop over all divisions
          for(let i = 0; i < result.length; i++){
            let value = result[i].division;
            let text = result[i].division;
            if(text != "NA"){
              // format divs for dropdown list
              if(!text.includes("U")){
                text = "Div " + text;
              }
              _this.options.push({
                value : value,
                text : text
              })
            }
          }
        })
    },
    methods : {
      // new paddler form submitted
      handleSubmit(e) {
        e.preventDefault();
        let _this = this;
        // get user from local storage
        let user = JSON.parse(localStorage.getItem('user'));
        // build data object
        let data = {
          name : _this.form.name,
          division : _this.form.division,
          class : _this.form.class,
          bcu : _this.form.bcu,
          club : user.clubID
        }
        // send paddler to be added to database
        _this.$http
          .post('/addPaddler', {
            data : data
          })
          .then(response => {
            _this.$swal("Submitted", "The new paddler has been added", "success");
          })
          .catch(error => {
            console.log(error);
            _this.$swal("Error", "Failed to add new paddler, please try again", "error");
          })
      }
    }
  }
</script>

<style scoped>
  #teamleader {
    background-color: rgba(203, 205, 206, 0.3);
    height: 100%;
  }

  .title {
    text-align: left;
    font-size: 28px;
    font-weight: 600;
  }

  .plus {
    color: lightgreen;
    font-size: 28px;
  }

  .noborder td {
    background: lightgrey;
  }

  .panel {
    border-radius: 10px;
    color: white;
  }

  .table {
    margin-bottom: 0px;
  }
</style>
