<template>
  <div id="raceorganiser" class=" py-4">
    <b-container class="text-center mx-auto">
      <b-row class="col-lg-12 mx-auto mt-4" align-h="center">
        <b-col class="panel py-4" md="5" style="background-color: rgb(254, 193, 6);">
          <h2>Organise a new race</h2>
          <b-form class="form" @submit="handleSubmit">
            <b-form-group label="Race name: ">
              <b-form-input
                type="text"
                v-model="form.racename"
                class="form-control"
                placeholder="Race name"
                required
                autofocus />
            </b-form-group>
            <b-form-group label="Race date: ">
              <b-form-input
                type="date"
                v-model="form.date"
                class="form-control"
                required />
            </b-form-group>
            <b-form-group id="region" label-for="regionSelect" label="Region: ">
                <b-form-select :options="regionNames" v-model="form.region" required/>
            </b-form-group>
            <b-button size="lg" variant="primary" block type="submit">Submit</b-button>
          </b-form>
        </b-col>
        <b-col class="panel py-4" offset-md="1" md="5" style="background-color: rgb(32, 169, 215);">
          <h2>Your races</h2>
          <table class="table">
              <thead>
                <tr>
                  <th scope="col">Race Name</th>
                  <th scope="col">Year</th>
                  <th scope="col">Complete</th>
                </tr>
              </thead>
              <tbody>
              <tr v-for="race in races">
                <th>
                  <a v-on:click="getRaceInfo(race, )">{{ race.raceName }}</a>
                </th>
                <th>{{ race.year }}</th>
                <th v-if="race.processed == 0"><svg class="tick" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="Layer_1" style="enable-background:new 0 0 50 50;" version="1.1" viewBox="0 0 50 50" xml:space="preserve"><g id="tick-icon" style="&#10;"><polygon points="47.293,6.94 14,40.232 2.707,28.94 1.293,30.353 14,43.06 48.707,8.353  "/></g></svg></th>
              </tr>
              </tbody>
            </table>
        </b-col>
      </b-row>
      <b-row class="col-lg-12 mx-auto mt-4" align-h="center">
        <b-col class="panel py-4" md="5" style="background-color: rgb(101, 196, 137);">
          <h2>Undefined</h2>

        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
    export default {
        name: "RaceOrganiser",
        data () {
          return {
            form: {
              racename: "",
              date: "",
              region: null
            },
            regionNames : [],
            regions: [],
            errors: [],
            races : []
          }
        },
        created() {
          let user = JSON.parse(localStorage.getItem('user'));
          let _this= this;
          this.$http
            .get('/regions')
            .then(response => {
              this.regions = response.data.response;
              let nameList = [];
              this.regions.forEach(function(x) {
                if(x.regionName != "ALL") {
                  nameList.push(x.regionName);
                }
              })
              this.regionNames = nameList;
            })
            .catch(e => {
              this.errors.push(e)
            }),
            this.$http
              .get('/getclubraces?id=' + user.userID)
              .then(response => {
                this.races = response.data.response;
              })
              .catch(error => {
                _this.$swal("You have no races", "", "error");
              })
        },
        methods : {
          handleSubmit(e){
            let _this= this;
            _this.getRegionID(_this.form.region)
            let userID = JSON.parse(localStorage.getItem('user')).clubID;
            let year = _this.form.date.substring(0, 4);
            let newDate = _this.form.date.substring(8, 10) + "/" + _this.form.date.substring(5, 7) + "/" + _this.form.date.substring(0, 4);
            this.$http.post('/insertrace', {
              name  : _this.form.racename,
              date : newDate,
              regionID : _this.form.region,
              clubID : userID,
              year: year
            })
              .then(response => {
                _this.$swal("Success", "The race has been added and should be accessible in your control panel.", "success")
                  .then(() => {
                    this.$router.go();
                  })
              })
              .catch(error => {
                _this.$swal("Race add Failed", error.response.data, "error");
              });
          },
          getRegionID(name){
            let _this= this;
            this.regions.forEach(function(x) {
              if(x.regionName === name) {
                _this.form.region = x.regionID;
              }
            })
          }
        }
    }
</script>

<style scoped>
 #raceorganiser {
    background-color: rgb(228, 229, 231);
 }

  .panel {
    border-radius: 10px;
    color: white;
  }

  .form {
    padding: 10px;
  }

  #tick-icon{
    fill: white;
  }

 .tick {
    width: 20px;
    height: 20px;
  }

</style>
