<template>
  <div id="teamleader" class=" mt-4">
    <loading :active.sync="isLoading"
             :can-cancel="false"
             :is-full-page="fullPage"
             :opacity="0.5">
    </loading>
    <b-container class="text-center">
      <b-row class="col-lg-12 mx-auto mt-4">
        <h2 class="title">Current Entries that are open</h2>
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
          <div>
            <table v-if="showEntries" class="table table-bordered">
              <thead class="thead-dark">
              <tr>
                <th scope="col" align="center" valign="middle" class="col-xs-1">Paddler</th>
                <!-- <th scope="col">Division</th>-->
                <th scope="col" align="center" valign="middle" class="col-xs-1">Number of Entries</th>
                <th scope="col" align="center" valign="middle" class="col-xs-1">Add Paddler</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(paddler, index) in paddlers">
                <td align="center" valign="middle">
                  {{ paddler.name }}
                </td>
                <!--<td>
                  {{ paddler.division }}
                </td>-->
                <td align="center" valign="middle">
                  {{ paddler.numEntries }}
                </td>
                <td align="center" valign="middle">
                  <router-link class="router" :to="{}">
                    <a v-on:click="paddlerEntered(index)"><div class="icon">K1</div></a>
                  </router-link>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </b-col>
        <b-col offset-md="1" md="4">
          <h2 v-if="showEntries" class="title">Entries so far</h2>
          <p v-if="(enteredPaddlers.length == 0 && submittedEntries.length == 0) && showEntries" class="text-left mb-0">There are no entries...</p>
          <table v-if="enteredPaddlers.length > 0 || submittedEntries.length > 0" class="table">
            <thead class="thead-dark">
            <tr>
              <th scope="col" align="center" valign="middle">Paddler</th>
              <th scope="col" align="center" valign="middle">Division</th>
              <th scope="col" align="center" valign="middle">Edit</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(paddler, index) in enteredPaddlers" v-bind:class="enteredPaddlers[index].k2 === 'yes' ? ' noborder ' : {} ">
              <td align="center" valign="middle" v-if="paddler.name != ''">
                {{ paddler.name }}
              </td>
              <td align="center" valign="middle" v-if="paddler.name != ''">
                {{ paddler.division }}
              </td>
              <td colspan="2" align="center" valign="middle" v-if="paddler.name === ''">
                <b-form-input v-model="search"
                              type="search"
                              placeholder="Search for a paddler"></b-form-input>

                <b-list-group class="paddlerList" v-if="dropdown">
                  <b-list-group-item  class="paddler" v-for="search_paddler in paddlerResults" :key="search_paddler.paddlerID" @click="addToK2(search_paddler, index, 1)">{{ search_paddler.clubcode }} : {{ search_paddler.name }}</b-list-group-item>
                </b-list-group>
              </td>
              <td align="center" valign="middle">
                <router-link :to="{}">
                  <a v-on:click="paddlerRemoved(index, 1)"><i class="fas fa-minus-circle minus"></i></a>
                </router-link>
                <router-link :to="{}" v-if="paddler.k2 != 'yes'">
                  <a v-on:click="addK2(index, 1)"><div class="icon">K2</div></a>
                </router-link>
              </td>
            </tr>
            <tr v-for="(paddler, index) in submittedEntries" v-bind:class="getClass(paddler.raceDivision)">
              <td align="center" valign="middle">
                {{ paddler.name }}
              </td>
              <td align="center" valign="middle">
                {{ paddler.division }}
              </td>
              <td align="center" valign="middle">
                <router-link :to="{}">
                  <a v-on:click="paddlerRemoved(index, 0)"><i class="fas fa-minus-circle minus"></i></a>
                </router-link>
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
        enteredPaddlers : [],
        session_boatID : 1,
        dropdown: false,
        paddlerResults: [],
        search : '',
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
      getClass(check){
        if(check.includes("_")){
          return { 'noborder' : true }
        }
      },
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
                  _this.submittedEntries.unshift(already[i]);
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
      checkDuplicate(index) {
        let _this = this;
        let duplicate = false;
        for (let i = 0; i < _this.submittedEntries.length; i++) {
          if (_this.submittedEntries[i].paddlerID === _this.paddlers[index].paddlerID) {
            _this.$swal("Duplicate Entry", "This paddler has already been entered.", "error");
            duplicate = true;
          }
        }
        for (let i = 0; i < _this.enteredPaddlers.length; i++) {
          console.log("Count: " + i + ", ID: " + _this.enteredPaddlers[i].paddlerID + ", Compared to: " + _this.paddlers[index].paddlerID);
          if (_this.enteredPaddlers[i].paddlerID === _this.paddlers[index].paddlerID) {
            _this.$swal("Duplicate Entry", "This paddler has already been entered.", "error");
            duplicate = true;
          }
        }
        return duplicate;
      },
      paddlerEntered(index){
        let _this = this;
        if(!_this.checkDuplicate(index)){
          _this.enteredPaddlers.unshift(_this.paddlers[index]);
        }
        /*if(_this.enteredPaddlers.includes(paddler)){
          _this.$swal("Duplicate Entry", "This paddler has already been entered.", "error");
        } else {
          _this.enteredPaddlers.push(paddler);
        }*/
      },
      paddlerRemoved(index, option){
        let _this = this;
        let user = JSON.parse(localStorage.getItem('user'));
        // if submitted entries
        if(option == 0){
          // submittedEntries
          let boatID = _this.submittedEntries[index].boatID;

          _this.$http
            .post('/deleteentry', {
              boatid : boatID
            })
            .then(response => {
              for(let i = 0; i < _this.submittedEntries.length; i++){
                if(_this.submittedEntries[i].boatID === boatID && _this.submittedEntries[index].paddlerID != _this.submittedEntries[i].paddlerID){
                  _this.submittedEntries.splice(i, 1);
                }
              }
              _this.submittedEntries.splice(index, 1);
              _this.raceSelected(_this.raceID, _this.raceName);
            })
            .catch(e => {
              console.log(e);
              _this.$swal("Failed to delete entry", "If the error persists please contact an administrator", "error");
            })
        // if current session entries
        } else if (option == 1){
          // check all paddlers
          for(let i = 0; i < _this.enteredPaddlers.length; i++){
            // see if they have a k2 entry
            if(_this.enteredPaddlers[i].boatID == _this.enteredPaddlers[index].boatID && index != i){
              // if they are a k2, remove k2 features as other paddler has been removed
              console.log("removed k2 features for: " + _this.enteredPaddlers[i].name);
              delete _this.enteredPaddlers[index]["k2"];
              delete _this.enteredPaddlers[index]["boatID"];
              delete _this.enteredPaddlers[i]["k2"];
              delete _this.enteredPaddlers[i]["boatID"];
              // if the remaining paddler is from another club then remove
              if(_this.enteredPaddlers[i].clubID != user.clubID){
                _this.$swal("K2 Fully deleted", "The remaining paddler is from different club, please re-enter the K2", "error")
                console.log("deleting: " + _this.enteredPaddlers[i].name);
                _this.enteredPaddlers.splice(i, 1);
              }
            }
          }

          _this.enteredPaddlers.splice(index, 1);
        }
      },
      submitEntries(){
        let _this = this;
        console.log(_this.enteredPaddlers);
        for(let i = 0; i < _this.enteredPaddlers.length; i++){
          if(_this.enteredPaddlers[i].k2 == "yes"){
            if(_this.enteredPaddlers[i].boatID == _this.enteredPaddlers[i+1].boatID){
              let newDiv = Math.floor((parseInt(_this.enteredPaddlers[i+1].division) + parseInt(_this.enteredPaddlers[i].division)) / 2);
              newDiv = newDiv + "_" + newDiv;
              _this.$http
                .post('/insertboatresult', {
                race: _this.raceID,
                div : newDiv
              })
                .then(response => {
                  let boatID = response.data.response.insertId;
                  let paddlerIDList = [_this.enteredPaddlers[i].paddlerID, _this.enteredPaddlers[i+1].paddlerID];

                  for(let x = 0; x < 2; x++){
                    _this.$http
                      .post('/insertpaddlerboat', {
                        boatid : boatID,
                        paddlerid : paddlerIDList[x]
                      })
                        .then(response2 => {

                        })
                        .catch(e => {
                          console.log(e);
                        })
                    }
                  _this.$swal("Entries Submitted", "Your entries have been submitted", "success")
                    .then(() => {
                      _this.raceSelected(_this.raceID, _this.raceName);
                    })
                })
                .catch(e => {
                  console.log(e);
                })
            }
          } else {
            _this.$http
              .post('/insertboatresult', {
                race : _this.raceID,
                div : _this.enteredPaddlers[i].division
              })
              .then(response => {
                let boatID = response.data.response.insertId;
                _this.$http
                  .post('/insertpaddlerboat', {
                    boatid : boatID,
                    paddlerid : _this.enteredPaddlers[i].paddlerID
                  })
                  .then(response2 => {
                    _this.$swal("Entries Submitted", "Your entries have been submitted", "success")
                      .then(() => {
                        _this.raceSelected(_this.raceID, _this.raceName);
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
      },
      addK2(index, option){
        let _this = this;
        if(option == 0){
          // do k2 stuff with submitted entries

        } else {
          console.log(_this.enteredPaddlers[index]);
          // do k2 stuff with current session entries
          _this.enteredPaddlers[index]["boatID"] = _this.session_boatID;
          _this.enteredPaddlers[index]["k2"] = "yes";
          let data = {
            k2 : "yes",
            boatID : _this.session_boatID,
            class: "",
            clubID: "",
            division: "",
            name: "",
            numEntries: "0",
            paddlerID: "0"
          }

          _this.enteredPaddlers.splice(index + 1, 0, data);
        }
      },
      addToK2(paddler, index, option){
        let _this = this;
        _this.dropdown = false;
        if(option == 0){
          // do submitted
        } else {
          // do current
            if(_this.enteredPaddlers[index].k2 === "yes"){
              _this.enteredPaddlers[index] = {
                k2 : "yes",
                boatID : _this.session_boatID,
                class: paddler.class,
                clubID: paddler.clubID,
                division: paddler.division,
                name: paddler.name,
                numEntries: "0",
                paddlerID: paddler.paddlerID
              }
              _this.session_boatID++;
            }
            console.log(_this.enteredPaddlers);

        }
      }
    },
    watch: {
      search: function() {
        let _this = this;
        if(_this.search.length >= 3){
          _this.dropdown = true;
          _this.$http
            .get('search?term=' + _this.search)
            .then(response => {
              _this.paddlerResults = response.data.response;
              if(_this.paddlerResults.length === 0){
                _this.$swal("No search results", "", "error");
              } else if (_this.paddlerResults.length === 1){
                //this.handlePaddler(this.paddlers[0]);
              }
            })
            .catch(error => {
              _this.$swal("Search error", error.response.data, "error");
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

  .noborder td {
    background: lightgrey;
  }

  .icon{
    line-height: 5px;
    font-weight: 800;
    text-align: center;
    font-size: 14px;
    color: white;
    background: darkgreen;
    width: 30px;
    height: 30px;
    margin: 10px;
    border-radius: 50%;
    padding: 12px 12px 12px 5px;
    text-decoration: none !important;
  }

  .router {
    text-decoration: none;
  }

</style>
