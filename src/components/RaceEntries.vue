<template>
  <div id="raceentries" class="pt-4">
    <b-container class="text-center">
      <b-row class="col-lg-12 mx-auto mt-4">
        <b-col class="p-0 text-left" md="7">
          <h2 class="title">Make entries for {{ raceName }} <b-button class="mb-2 py-1" v-b-toggle.collapse-1 variant="primary">How to</b-button></h2>

          <b-collapse id="collapse-1" class="my-2">
            <b-card>
              <p class="card-text">
                Press the K1 button to enter the paddler or search for them in the field below.
                They will then appear on the right hand side in the entries so far list. Here, the K2 button can be
                selected to either select the paddlers partner on the left hand side or via the small
                search box that pops up. Make sure to submit entries using the button that will appear once
                entries have been made.
              </p>
            </b-card>
          </b-collapse>
          <p id="mobileText" class="title">Mobile mode: only search can be used to make entries</p>
          <div class="mb-3">
            <b-form-input
              v-model="search"
              type="search"
              placeholder="Search for a paddler from your club">
            </b-form-input>
            <b-list-group class="paddlerList" v-if="dropdown">
              <b-list-group-item  class="paddler" v-for="(search_paddler, index) in clubSearch" :key="search_paddler.paddlerID" @click="paddlerEnteredSearch(search_paddler)">{{ search_paddler.name }}</b-list-group-item>
            </b-list-group>
          </div>
          <div>
            <table class="table table-bordered" id="paddlerTable">
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
                    <a v-if="!k2Mode" v-on:click="paddlerEntered(index)"><div class="icon">K1</div></a>
                    <a v-if="k2Mode" v-on:click="addToK2(paddler, selectedK2index, 1)"><div class="icon">K2</div></a>
                  </router-link>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </b-col>
        <b-col id="mobileEntries" offset-md="1" md="4">
          <h2 class="title">Entries so far</h2>
          <p v-if="(enteredPaddlers.length == 0 && submittedEntries.length == 0)" class="text-left mb-0">There are no entries...</p>
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
                  <b-list-group-item  class="paddler" v-for="search_paddler in paddlerSearchResults" :key="search_paddler.paddlerID" @click="addToK2(search_paddler, index, 1)">{{ search_paddler.clubcode }} : {{ search_paddler.name }}</b-list-group-item>
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
                {{ paddler.raceDivision }}
              </td>
              <td align="center" valign="middle">
                <router-link :to="{}">
                  <a v-on:click="paddlerRemoved(index, 0)"><i class="fas fa-minus-circle minus"></i></a>
                </router-link>
              </td>
            </tr>
            </tbody>
          </table>
          <b-button v-if="enteredPaddlers.length > 0" class="ml-0 mb-4" size="sm" variant="primary" v-on:click="submitEntries">Submit Entries</b-button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
    export default {
      name: "RaceEntries",
      data () {
        return {
          errors: [],
          paddlers : [],
          raceName : "",
          raceID : 0,
          submittedEntries : [],
          enteredPaddlers : [],
          session_boatID : 1,
          dropdown: false,
          paddlerSearchResults: [],
          search : '',
          k2Mode: false,
          selectedK2index : 0,
          allRacersEntered : []
        }
      },
      created(){
        let _this = this;
        _this.raceName = this.$route.params.name;
        _this.raceID = this.$route.params.id;
        _this.enteredPaddlers = [];
        _this.submittedEntries = [];
        let user = JSON.parse(localStorage.getItem('user'));

        _this.$http
          .get('/getracepaddlers?id=' + _this.raceID)
          .then(response => {
            let result = response.data.response;
            _this.allRacersEntered = result;
            _this.$http
              .get("/clubpaddlers?club=" + user.clubID)
              .then(response => {
                let paddlers = response.data.response;
                _this.paddlers = paddlers;
                _this.$http
                  .get("/clubraceentries?raceid=" + _this.raceID + "&clubid=" + user.clubID)
                  .then(response => {
                    let already  = response.data.response;
                    for(let i = 0; i < already.length; i++){
                      _this.submittedEntries.unshift(already[i]);
                      for(let x = 0; x < _this.allRacersEntered.length; x++){
                        if(_this.allRacersEntered[x].boatID === already[i].boatID && _this.allRacersEntered[x].paddlerID != already[i].paddlerID && _this.allRacersEntered[x].clubID != already[i].clubID){
                          _this.allRacersEntered[x].name = _this.allRacersEntered[x].name + " (" + _this.allRacersEntered[x].clubcode + ")";
                          _this.submittedEntries.unshift(_this.allRacersEntered[x]);
                        }
                      }

                    }
                  })
                  .catch(e => {
                    console.log(e);
                  })
              })
              .catch(e => {
                _this.$swal("There was an error", "There was an error loading the club paddlers, please try again.", "error");
                console.log(e);
              })
          })
          .catch(e => {
            this.errors.push(e)
          })
      },
      methods : {
        closeDropdown(){
          let _this = this;
          _this.dropdown = false;
        },
        getClass(check){
          if(check.includes("_")){
            return { 'noborder' : true }
          }
        },
        checkDuplicate(index) {
          let _this = this;
          let duplicate = false;
          for (let i = 0; i < _this.allRacersEntered.length; i++) {
            if (_this.allRacersEntered[i].paddlerID === _this.paddlers[index].paddlerID) {
              _this.$swal("Duplicate Entry", "This paddler has already been entered.", "error");
              duplicate = true;
            }
          }
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
              console.log("yesy");
              duplicate = true;
            }
          }
          return duplicate;
        },
        paddlerEntered(index){
          let _this = this;
          _this.search = "";
          _this.closeDropdown();
          if(!_this.checkDuplicate(index)){
            _this.enteredPaddlers.unshift(_this.paddlers[index]);
          }
          /*if(_this.enteredPaddlers.includes(paddler)){
            _this.$swal("Duplicate Entry", "This paddler has already been entered.", "error");
          } else {
            _this.enteredPaddlers.push(paddler);
          }*/
        },
        paddlerEnteredSearch(searchPaddler){
          let _this = this;
          _this.search = "";
          _this.closeDropdown();
          console.log("Searched paddler: " + searchPaddler.name);
          for(let i = 0; i < _this.paddlers.length; i++){
            if(_this.paddlers[i].paddlerID == searchPaddler.paddlerID){
              console.log("found in list");
              if(!_this.checkDuplicate(i)){
                _this.enteredPaddlers.unshift(_this.paddlers[i]);
              }
            } else {

            }
          }

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
                this.$forceUpdate();
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
          for(let i = 0; i < _this.enteredPaddlers.length; i++){
            if(_this.enteredPaddlers[i].k2 == "yes" && _this.enteredPaddlers[i+1] != null){
              if((_this.enteredPaddlers[i].boatID == _this.enteredPaddlers[i+1].boatID)){
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
                          // k2 entered
                        })
                        .catch(e => {
                          console.log(e);
                        })
                    }
                    _this.$swal("Entries Submitted", "Your entries have been submitted", "success")
                      .then(() => {
                        this.$router.go();
                      })
                  })
                  .catch(e => {
                    _this.$swal("K2 Entry error", "The page will now refresh, please check and see what entries were submitted and correct any errors.", "error")
                      .then(() => {
                        this.$router.go();
                      })
                    console.log(e);
                  })
              }
            } else if (_this.enteredPaddlers[i].k2 != "yes") {
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
                          this.$router.go();
                        })

                    })
                    .catch(e => {
                      _this.$swal("Error", "The page will now refresh, please check and see what entries were submitted and correct any errors.", "error")
                        .then(() => {
                          this.$router.go();
                        })
                    })
                })
                .catch(e => {
                  _this.$swal("Error", "The page will now refresh, please check and see what entries were submitted and correct any errors.", "error")
                    .then(() => {
                      this.$router.go();
                    })
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
            _this.k2Mode = true;
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
            _this.selectedK2index = index +1;
            console.log("added blank paddler");
          }
        },
        addToK2(paddler, index, option){
          let _this = this;
          _this.search = "";
          _this.dropdown = false;
          if(option == 0){
            // do submitted
          } else {
            let duplicate = false;
            for (let i = 0; i < _this.allRacersEntered.length; i++) {
              if (_this.allRacersEntered[i].paddlerID == paddler.paddlerID) {
                _this.$swal("Duplicate Entry", "This paddler has already been entered.", "error");
                duplicate = true;
              }
            }
            if(!duplicate) {
              // do current
              //console.log(_this.enteredPaddlers[index]);
              if (_this.enteredPaddlers[index].k2 === "yes") {
                _this.enteredPaddlers[index] = {
                  k2: "yes",
                  boatID: _this.session_boatID,
                  class: paddler.class,
                  clubID: paddler.clubID,
                  division: paddler.division,
                  name: paddler.name,
                  numEntries: "0",
                  paddlerID: paddler.paddlerID
                }
                _this.session_boatID++;
              }
              //console.log(_this.enteredPaddlers);
              _this.k2Mode = false;
            }
          }
        },
        getK2Partner(boatID){
          let _this = this;
          for(let i = 0; i < _this.allRacersEntered; i++){

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
                _this.paddlerSearchResults = response.data.response;
                if(_this.paddlerSearchResults.length === 0){
                  _this.$swal("No search results", "", "error");
                } else if (_this.paddlerSearchResults.length === 1){
                  //this.handlePaddler(this.paddlers[0]);
                }
              })
              .catch(error => {
                _this.$swal("Search error", error.response.data, "error");
              })
          } else {
            _this.closeDropdown();
          }
        },
        clubSearch: function() {
          let _this = this;
          if(_this.search.length < 3){
            _this.closeDropdown();
          }
        }
      },
      computed : {
        clubSearch: function() {
          let _this = this;
          return _this.paddlers.filter(
            function(paddler){
              return paddler.name.toLowerCase().indexOf(_this.search.toLowerCase())>=0;
            }
          )
        }
      }
    }
</script>

<style scoped>

  #raceentries {
    background-color: rgba(203, 205, 206, 0.3);
  }

  .table-bordered {
    border: 1px solid black !important;
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
    margin: 0px;
    border-radius: 50%;
    padding: 12px 12px 12px 5px;
    text-decoration: none !important;
  }

  .router {
    text-decoration: none;
  }

  #mobileText {
    display: none;
    color: red;
    font-size: 18px;
    margin-bottom: 5px;
  }

  @media only screen and (max-width: 768px) {
    #paddlerTable {
      display: none;
    }

    #mobileEntries {
      padding-left: 0px;
    }

    #raceentries {
      height: calc(100vh - 56px);
    }

    #mobileText {
      display: block;
    }
  }
</style>
