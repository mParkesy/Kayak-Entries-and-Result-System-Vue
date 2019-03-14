<template>
  <div id="teamleader" class=" mt-4">
    <loading :active.sync="isLoading"
             :can-cancel="false"
             :is-full-page="fullPage"
             :opacity="0.5">
    </loading>
    <b-modal id="modal1" title="BootstrapVue">
      <p class="">Hello from modal!</p>
    </b-modal>
    <b-container class="text-center">
      <b-row class="col-lg-12 mx-auto mt-4">
        <h2 class="title">Current Entries that are open</h2><b-button v-b-modal.modal1>Launch demo modal</b-button>
      </b-row>
      <b-row class="col-lg-12 mx-auto mt-4">
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
                <router-link :to="{}">
                  <a class="raceName" v-on:click="raceSelected(race.raceID, race.raceName)">{{ race.raceName }}</a>
                </router-link>
              </th>
              <th>
                  {{ race.entryCloses.getDate() + "th " + months[race.entryCloses.getMonth()] + " at 10pm" }}
              </th>
              <th>
                <router-link :to="{}">
                  <a v-on:click="raceSelected(race.raceID, race.raceName)"><i class="fas fa-sign-in-alt plus"></i></a>
                </router-link>
              </th>
            </tr>
            </tbody>
          </table>
      </b-row>
      <b-row class="col-lg-12 mx-auto mt-4">
        <b-col class="p-0" md="7">
          <h2 v-if="showEntries" class="title">Make entries for {{ raceName }}</h2>
          <table v-if="showEntries" class="table table-bordered">
            <thead class="thead-dark">
            <tr>
              <th scope="col">Paddler</th>
              <th scope="col">Division</th>
              <th scope="col">Class</th>
              <th scope="col">Number of Entries</th>
              <th scope="col">Enter</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(paddler, index) in paddlers">
              <td>
                {{ paddler.name }}
              </td>
              <td>
                {{ paddler.division }}
              </td>
              <td>
                {{ paddler.class }}
              </td>
              <td>
                {{ paddler.numEntries }}
              </td>
              <td>
                <router-link :to="{}">
                  <a v-on:click="paddlerEntered(index)"><i class="fas fa-plus-circle plus"></i></a>
                </router-link>
              </td>
            </tr>
            </tbody>
          </table>
        </b-col>
        <b-col class="mb-4" offset-md="1" md="4">
          <h2 v-if="showEntries" class="title">Entries so far</h2>
          <p v-if="(enteredPaddlers.length == 0 && submittedEntries.length == 0) && showEntries" class="text-left mb-0">There are no entries...</p>
          <table v-if="enteredPaddlers.length > 0 || submittedEntries.length > 0" class="table table-bordered">
            <thead class="thead-dark">
            <tr>
              <th scope="col">Paddler</th>
              <th scope="col">Division</th>
              <th scope="col">Remove</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(paddler, index) in submittedEntries">
              <td>
                {{ paddler.name }}
              </td>
              <td>
                {{ paddler.division }}
              </td>
              <td>
                <a v-on:click="paddlerRemoved(index, 0)"><i class="fas fa-minus-circle minus"></i></a>
              </td>
            </tr>
            <tr v-for="(paddler, index) in enteredPaddlers">
              <td>
                {{ paddler.name }}
              </td>
              <td>
                {{ paddler.division }}
              </td>
              <td>
                <a v-on:click="paddlerRemoved(index, 1)"><i class="fas fa-minus-circle minus"></i></a>
              </td>
            </tr>
            </tbody>
          </table>
          <b-button v-if="enteredPaddlers.length > 0 && showEntries" class="ml-0" size="sm" variant="primary" v-on:click="submitEntries">Submit Entries</b-button>
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
          races: [],
          errors: [],
          months: ["January", "February", "March", "April", "May", "June", "July", "August", "September",
            "October", "November", "December"],
          showEntries: false,
          paddlers : [],
          isLoading : false,
          fullPage : true,
          raceName : "",
          raceID : 0,
          submittedEntries : [],
          enteredPaddlers : []
        }
      },
      components: {
        Loading
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
          _this.$swal("There was an error", "There was an error loading the races for entry, please try again.", "error");
          console.log(e);
        })
      },
      methods : {
        raceSelected(id, raceName) {
          let _this = this;
          _this.raceName = raceName;
          _this.raceID = id;
          _this.enteredPaddlers = [];
          _this.submittedEntries = [];
          let user = JSON.parse(localStorage.getItem('user'));
          _this.isLoading = true;
          _this.$http
            .get("/clubpaddlers?club=" + user.clubID)
            .then(response => {
              let paddlers = response.data.response;
              _this.paddlers = paddlers;
              _this.$http
                .get("/clubraceentries?raceid=" + id + "&clubid=" + user.clubID)
                .then(response => {
                  let already  = response.data.response;
                  for(let i = 0; i < already.length; i++){
                    _this.submittedEntries.push(already[i]);
                  }
                })
                .catch(e => {
                  console.log(e);
                })
              _this.isLoading = false;
              _this.showEntries = true;
            })
            .catch(e => {
              _this.$swal("There was an error", "There was an error loading the club paddlers, please try again.", "error");
              console.log(e);
            })

        },
        paddlerEntered(index){
          let _this = this;
          let duplicate = false;
          for(let i = 0; i < _this.submittedEntries.length; i++){
            if(_this.submittedEntries[i].paddlerID == _this.paddlers[index].paddlerID){
              _this.$swal("Duplicate Entry", "This paddler has already been entered.", "error");
              duplicate = true;
            }
          }
          for(let i = 0; i < _this.enteredPaddlers.length; i++){
            if(_this.enteredPaddlers[i].paddlerID == _this.paddlers[index].paddlerID){
              _this.$swal("Duplicate Entry", "This paddler has already been entered.", "error");
              duplicate = true;
            }
          }
          if(!duplicate){
            _this.enteredPaddlers.push(_this.paddlers[index]);
          }
          /*if(_this.enteredPaddlers.includes(paddler)){
            _this.$swal("Duplicate Entry", "This paddler has already been entered.", "error");
          } else {
            _this.enteredPaddlers.push(paddler);
          }*/
        },
        paddlerRemoved(index, option){
          let _this = this;
          if(option == 0){
            // submittedEntries
            let boatID = _this.submittedEntries[index].boatID;
            _this.$http
              .post('/deleteentry', {
                boatid : boatID
              })
              .then(response => {
                _this.submittedEntries.splice(index, 1);
              })
              .catch(e => {
                console.log(e);
                _this.$swal("Failed to delete entry", "If the error persists please contact an administrator", "error");
              })

          } else if (option == 1){
            _this.enteredPaddlers.splice(index, 1);
          }

       /*   let d;
          let boatID;
          if(_this.enteredPaddlers.includes(_this.paddlers[index])){
            /!*for(let i = 0; i < _this.enteredPaddlers.length; i++){
              if(_this.enteredPaddlers[i].paddlerID = paddler.paddlerID){
                d = i;
                console.log("deleting " + paddler.name);
                console.log("position " + d);
              }
            }*!/
            this.enteredPaddlers.splice(index, 1);
          } else if (_this.submittedEntries.includes(_this.paddlers[index])){
            for(let x = 0; x < _this.submittedEntries.length; x++){
              //console.log(_this.submittedEntries);
              if(_this.submittedEntries[x].paddlerID = paddler.paddlerID){
                d = x;
                //console.log("deleting " + paddler.name);
                //console.log("position " + d);
                boatID = _this.submittedEntries[x].boatID;
              }
            }
            _this.submittedEntries.splice(d, 1);
            _this.$http
              .post('/deleteentry', {
                boatid : boatID
              })
              .then(response => {
                console.log(response.data.response);
              })
              .catch(e => {
                console.log(e);
              })
          }*/
        },
        submitEntries(){
          let _this = this;
          for(let i = 0; i < _this.enteredPaddlers.length; i++){
            _this.$http
              .get('/insertboat?div=' + _this.enteredPaddlers[i].division)
              .then(response => {
                let boatID = response.data.response.insertId;
                _this.$http
                  .post('/insertpaddlerboat', {
                    boatid : boatID,
                    paddlerid : _this.enteredPaddlers[i].paddlerID
                  })
                  .then(response2 => {
                    console.log(response2.data.response);
                    _this.$http
                      .post('/insertraceresult', {
                        boat : boatID,
                        race : _this.raceID,
                        div : _this.enteredPaddlers[i].division
                      })
                      .then(response3 => {
                        _this.$swal("Entries Submitted", "Your entries have been submitted", "success")
                          .then(() => {
                            this.$router.go();
                          })
                      })
                      .catch(e => {
                        console.log(e);
                      })
                  })
                  .catch(e => {
                    console.log(e);
                  })
              })
              .catch(e => {
                console.log(e);
              })
          }
        }
      }
    }
</script>

<style scoped>
  .title {
    text-align: left;
    font-size: 28px;
    font-weight: 600;
  }

  .plus {
    color: lightgreen;
    font-size: 28px;
  }

  .minus {
    color: red;
    font-size: 28px;
  }

</style>
