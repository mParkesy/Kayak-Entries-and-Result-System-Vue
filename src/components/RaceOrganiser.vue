<!--
  This is the race organiser component where the organiser can make a race and see the details to do with
  the races they have organised.
-->

<template>
  <div id="raceorganiser" class="py-4">
    <b-container class="text-center mx-auto">
      <b-modal hide-footer centered id="enterPaddler" ref="enterPaddler" title="Enter Paddler">
        <b-alert class="my-2 mx-3" :show="message.show" :variant="message.type">{{ message.text }}</b-alert>
        Type the paddlers name and click ok.
        If you are entering a K2, search another name before pressing Ok.
        <b-form class="form" @submit="">
          <b-form-input v-model="search"
                        type="search"
                        placeholder="Search for a paddler"
                        ref="search"
                        autocomplete="off"
          ></b-form-input>

          <b-list-group class="paddlerList" v-if="dropdown">
            <b-list-group-item class="paddler" v-for="search_paddler in paddlerSearchResults" :key="search_paddler.paddlerID" @click="selectSearch(search_paddler)">{{ search_paddler.clubcode }} : {{ search_paddler.name }}</b-list-group-item>
          </b-list-group>
          <p v-if="Object.keys(paddler1).length > 0" class="text-left mt-4">Paddler 1: {{ paddler1.name }} ({{paddler1.clubcode}})</p>
          <p v-if="Object.keys(paddler2).length > 0" class="text-left mt-4">Paddler 2: {{ paddler2.name }} ({{paddler2.clubcode}})</p>
          <b-alert class="my-1 mx-3" :show="Object.keys(paddler1).length > 0 && Object.keys(paddler2).length > 0" variant="warning">Pressing Ok will enter the two paddlers above in K2</b-alert>
          <b-alert class="my-1 mx-3" :show="Object.keys(paddler1).length > 0 && Object.keys(paddler2).length === 0" variant="warning">Pressing Ok will enter this paddler as a K1</b-alert>
          <b-button v-on:click="enterPaddlerSubmit()" class="mt-3 py-1 px-4" size="sm" variant="primary">Submit</b-button>
        </b-form>
      </b-modal>
      <b-modal id="editRace" ref="modal" title="Edit Race" @ok="handleUpdateOk">
        <b-form class="form" @submit.stop.prevent="handleUpdateSubmit">
          <b-form-group label="Race name: ">
            <b-form-input
              type="text"
              v-model="raceView.raceName"
              class="form-control"
              placeholder="Race name"
              required
              autofocus />
          </b-form-group>
          <b-form-group label="Race date: ">
            <b-form-input
              type="date"
              v-model="raceView.date"
              class="form-control"
              required />
          </b-form-group>
        </b-form>
      </b-modal>
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
            <b-button size="lg" variant="primary" block type="submit">Submit</b-button>
          </b-form>
        </b-col>
        <b-col class="panel py-4 racesList" offset-md="1" md="6" style="background-color: rgb(32, 169, 215);">
          <h2>Your races</h2>
          <table class="table">
              <thead>
                <tr>
                  <th scope="col">Race Name</th>
                  <th scope="col">Year</th>
                  <th scope="col">Complete</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
              <tr v-for="race in races">
                <th>
                  <a class="raceName" v-on:click="getRaceInfo(race)">{{ race.raceName }}</a>
                </th>
                <th>{{ race.year }}</th>
                <th v-if="race.processed == 2"><svg class="tick" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="Layer_1" style="enable-background:new 0 0 50 50;" version="1.1" viewBox="0 0 50 50" xml:space="preserve"><g id="tick-icon" style="&#10;"><polygon points="47.293,6.94 14,40.232 2.707,28.94 1.293,30.353 14,43.06 48.707,8.353  "/></g></svg></th>
                <th v-if="race.processed == 0">x</th>
                <th><a class="raceName" v-on:click="getRaceInfo(race)"><div class="icon">Go</div></a></th>
              </tr>
              </tbody>
            </table>
            <p>Select a race to see its details</p>
        </b-col>
      </b-row>
      <b-row class="col-lg-12 mx-auto" align-h="center">
        <b-col v-if="raceShow" md="12" class="panel raceView px-4 pb-3" style="background-color: rgb(101, 196, 137);">
            <b-row>
              <b-col class="col-md-5">
                <h2>{{ raceView.raceName }}</h2>
                <h2>
                  <b-button v-if="raceView.processed == 0" class="mb-2" size="sm" variant="primary" type="submit" v-b-modal.enterPaddler>Enter paddler</b-button>
                  <b-button v-if="raceView.processed == 0" v-on:click="assignNumbers" class="mb-2" size="sm" variant="primary" type="submit">Assign boat numbers</b-button>
                  <b-form-select v-model="selected" :options="clubList" @change="getClubEntries" class="mb-2 mt-1">
                    <template slot="first">
                      <option :value="null" disabled>Club Entries</option>
                    </template>
                  </b-form-select>
                  <router-link :to="{ name: 'runrace', params: { id: raceView.raceID }}">
                    <b-button  v-on:click="assignNumbers" v-if="raceView.processed == 0" class="mb-2" size="sm" variant="primary" type="submit">Run race</b-button>
                  </router-link>
                  <b-button class="mb-2" size="sm" variant="primary" type="submit" v-b-modal.editRace>Edit Race</b-button>
                </h2>
                <p class="text-left mb-0">Select a division to see the entries:</p>
                <p v-if="results.length == 0" class="text-left mb-0">There are no entries...</p>
                <b-list-group class="my-2">
                  <b-list-group-item button class="d-flex justify-content-between align-items-center text-dark raceName" v-for="x in results" :key="x.name" v-on:click="seeDivision(x,  x[0].raceDivision)">
                    {{ x[0].raceDivision }}
                    <b-badge variant="primary" pill>{{ x.length }}</b-badge>
                  </b-list-group-item>
                </b-list-group>
              </b-col>
              <b-col class="col-md-6 pr-2 divisionList ml-3" offset="1">
                <div class="xScroll" v-if="showDiv">
                  <table class="table mt-5" v-bind:class="selected.includes('_') ? ' k2Table ' : {} ">
                    <thead>
                      <tr>
                        <th valign="middle" scope="col">Boat Number</th>
                        <th valign="middle" scope="col">Name</th>
                        <th scope="col">Club</th>
                        <th scope="col">Div</th>
                        <th scope="col">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(line, index) in divRace">
                      <td>{{ line.boatname }}</td>
                      <td>{{ line.name }}</td>
                      <td>{{ line.clubcode }}</td>
                      <td>{{ line.raceDivision }}</td>
                      <td><a v-on:click="paddlerRemoved(index)"><i class="fas fa-minus-circle minus"></i></a></td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </b-col>
            </b-row>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
    import {sortRaces, htmlDateToUK, UKTohtmlDate} from "../worker";

    export default {
        name: "RaceOrganiser",
        data () {
          return {
            form: {
              racename: "",
              date: ""
            },
            errors: [],
            races : [],
            raceView : [],
            raceShow : false,
            visible: false,
            results : [],
            divRace: [],
            showDiv: false,
            selected: "",
            editForm: {
              racename: "",
              year: ""
            },
            search : '',
            dropdown: false,
            paddlerSearchResults : [],
            message : [],
            allRacersEntered : [],
            clubList : [],
            selected : null,
            paddler1 : {},
            paddler2: {},
            club : []
          }
        },
        created() {
          // get local storage user
          let user = JSON.parse(localStorage.getItem('user'));
          let _this= this;
          //get races organised by club
            _this.$http
              .get('/getclubraces?id=' + user.clubID)
              .then(response => {
                _this.races = response.data.response;
              })
              .catch(error => {
                _this.$swal("You have no races", "", "error");
                console.log(error)
              })
          // get details of club
          _this.$http
            .get('/club?id='+user.clubID)
            .then(response => {
              _this.club = response.data.response[0];
            })

        },
        methods : {
          // when new race submitted
          handleSubmit(e){
            e.preventDefault();
            let _this= this;
            let userID = JSON.parse(localStorage.getItem('user')).clubID;
            let year = _this.form.date.substring(0, 4);
            // convert date to uk format
            let newDate = htmlDateToUK(_this.form.date);
            // insert race into database
            this.$http.post('/insertrace', {
              name  : _this.form.racename,
              date : newDate,
              clubID : userID,
              year: year,
              region : _this.club.regionID
            })
              .then(response => {
                _this.$swal("Success", "The race has been added and should be accessible in your control panel.", "success")
                  .then(() => {
                    this.$router.go();
                  })
              })
              // if fail insert then show error
              .catch(error => {
                console.log(error)
                _this.$swal("Race add Failed", "Please try again", "error");
              });
          },
          handleUpdateOk(e){
            // if ok button pressed on race update details then run update function
            e.preventDefault();
            this.handleUpdateSubmit();
          },
          handleUpdateSubmit(){
            let _this= this;
            // get year and date in uk format
            let year = _this.raceView.date.substring(0, 4);
            let date = htmlDateToUK(_this.raceView.date);
            // update the race on teh database
            this.$http.post('/updaterace', {
              name  : _this.raceView.raceName,
              date : date,
              year: year,
              raceID : _this.raceView.raceID,
            })
              // if successfull then close the modal
              .then(response => {
                this.$nextTick(() => {
                  this.$refs.modal.hide()
                })
                _this.$swal("Success", "The race has been updated.", "success")
              })
              // if update failed
              .catch(error => {
                console.log(error);
                _this.$swal("Race update Failed", "Please try again", "error");
              });
          },
          // get race info when a race in list is selected
          getRaceInfo(race){
            let _this= this;
            // store needed fields
            _this.raceView = race;
            _this.raceView.date = UKTohtmlDate(_this.raceView.date);
            _this.raceShow = true;
            _this.showDiv = false;
            _this.entryNumbers = [];
            // get all race results so far
            this.$http
              .get('/raceresult_number?id=' + race.raceID)
              .then(response => {
                let results = sortRaces(response.data.response);
                _this.results = results;
              })
              .catch(e => {
                console.log(e);s
                this.errors.push(e)
              })
            // get paddlers entered into the whole race in different format to above
            _this.$http
              .get('/getracepaddlers?id=' + race.raceID)
              .then(response => {
                let result = response.data.response;
                _this.allRacersEntered = result;
                let clubs = [];
                // collect each club for the paddlers entered
                for(let i = 0; i < _this.allRacersEntered.length; i++) {
                  let club = {
                    value: _this.allRacersEntered[i].clubcode,
                    text: _this.allRacersEntered[i].clubname,
                  };
                  clubs.push(club);

                }
                // make sure club list only has unique values
                _this.clubList = [...new Set(clubs.map(x => x.value))];
              })
              .catch(e => {
                console.log(e);
                _this.errors.push(e)
              })


          },
          // sends to page with club entries for race
          getClubEntries(){
            let _this = this;
            // assign numbers for changing page
            _this.assignNumbers();
            if(_this.selected != null){
              // get club details by club code
              _this.$http
                .get('clubbycode?code=' + _this.selected)
                .then(response => {
                  let clubID = response.data[0].clubID;
                  // send entries list page
                  window.location = "/clubentries/" + _this.raceView.raceID + "/" + clubID;
                })
                .catch(error => {
                  console.log(error)
                  _this.errors.push(error)
                })
            }
          },
          // see the results/entries for a division so far
          seeDivision(race, selected){
            let _this = this;
            _this.divRace = race;
            _this.selected = selected;
            _this.showDiv = true;
          },
          // assigns a boat number to each boat
          assignNumbers(){
            let _this = this;
            let divList = [];
            for(let i = 0; i < _this.results.length; i++){
              // gets a list of divs
              divList.push(_this.results[i][0].raceDivision);
            }
            let data = {
              raceID : _this.raceView.raceID,
              divList : divList
            }
            // sends the race ID and list of divisions that need boat numbers assigning to back end
            _this.$http
              .post('/assignboatnumbers', {
                data : data
            })
              .then(response => {
                // if successfull reload race details so boat numbers are shown
                _this.$swal("Success", "Boat numbers have been assigned.", "success")
                  .then(() => {
                    _this.getRaceInfo(_this.raceView);
                  })
            })
              .catch(error => {
                _this.$swal("Failed to assign boat numbers", "Please try again", "error");
                _this.errors.push(e)
                console.log(e);
              })
          },
          // close the dropdown
          closeDropdown(){
            let _this = this;
            _this.dropdown = false;
          },
          // if a paddler has been selected from the search field
          selectSearch(paddler){
            let _this = this;
            let duplicate = false;
            // check to see if duplicate entry
            for(let i = 0; i < _this.allRacersEntered.length; i ++){
              let current = _this.allRacersEntered[i];
              if(paddler.paddlerID == current.paddlerID){
                duplicate = true;
              }
            }
            // if duplicate send message to view
            if(duplicate) {
              _this.message = {
                show: true,
                type: "danger",
                text: "Duplicate Entry"
              };
              // if first paddler in entry then assign to paddler 1
            } else if(Object.keys(_this.paddler1).length === 0){
              _this.paddler1 = paddler;
              // if second paddler then its a K2 being entered
            } else if(Object.keys(_this.paddler1).length > 0 && Object.keys(_this.paddler2).length === 0){
              _this.paddler2 = paddler;
            }
            _this.dropdown = false;
            _this.search = "";
          },
          // when a organiser entry is being submitted
          enterPaddlerSubmit(){
            let _this = this;
            // work out if k1 or k2 entry
            let paddler1_length = Object.keys(_this.paddler1).length;
            let paddler2_length = Object.keys(_this.paddler2).length;
            if(paddler1_length > 0 && paddler2_length === 0){
              // k1 entry
              _this.addPaddler(_this.paddler1);
              _this.paddler1 = [];
              _this.paddler2 = [];
              _this.message = {};
            } else if (paddler1_length > 0 && paddler2_length > 0){
              // k2 entry
              // get new div for k2
              let newDiv = Math.floor((parseInt(_this.paddler1.division) + parseInt(_this.paddler2.division)) / 2);
              newDiv = newDiv + "_" + newDiv;
              // insert boat result
              _this.$http
                .post('/insertboatresult',{
                  race : _this.raceView.raceID,
                  div : newDiv
                })
                .then(response => {
                  let boatID = response.data.response.insertId;
                  // use insert id to insert paddler boat to determine paddlers in a boat
                  let paddlerIDList = [_this.paddler1.paddlerID, _this.paddler2.paddlerID];
                  for(let i = 0; i < 2; i++){
                    _this.$http
                      .post('/insertpaddlerboat', {
                        boatid : boatID,
                        paddlerid : paddlerIDList[i]
                      })
                      .then(response2 => {
                        // complete so clear arrays
                        _this.paddler1 = [];
                        _this.paddler2 = [];
                        _this.message = {};
                        _this.message = {
                          show : true,
                          type : "success",
                          text : "K2 entry submitted"
                        };
                        _this.getRaceInfo(_this.raceView);
                      })
                      .catch(e => {
                        // send error message
                        _this.message = {
                          show : true,
                          type : "danger",
                          text : "K2 entry failed, please try again"
                        };
                        console.log(e);
                      })
                  }
                })
                .catch(e => {
                  // send error message
                  _this.message = {
                    show : true,
                    type : "danger",
                    text : "K2 entry failed, please try again"
                  };
                  console.log(e);
                })
            } else {
              // no entry, clear arrays
              _this.message = {
                show : true,
                type : "danger",
                text : "Error, please try again."
              };
              _this.paddler1 = [];
              _this.paddler2 = [];
              _this.message = {};
              _this.getRaceInfo(_this.raceView);
            }
          },
          // add a paddler function
          addPaddler(paddler){
            let _this = this;
            let duplicate = false;
            // checks to see if duplicate entry
            for(let i = 0; i < _this.allRacersEntered.length; i ++){
                let current = _this.allRacersEntered[i];
                if(paddler.paddlerID == current.paddlerID){
                  duplicate = true;
                }
            }
            // if duplicate send error message
            if(duplicate){
              _this.message = {
                show : true,
                type : "danger",
                text : "Duplicate Entry"
              };
            } else {
              // insert boat result field
              _this.$http
                .post('/insertboatresult', {
                  race : _this.raceView.raceID,
                  div : paddler.division
                })
                .then(response => {
                  // use insert if to insert the paddler boat field
                  let boatID = response.data.response.insertId;
                  _this.$http
                    .post('/insertpaddlerboat', {
                      boatid : boatID,
                      paddlerid : paddler.paddlerID
                    })
                    .then(response2 => {
                      // success message
                      _this.message = {
                        show : true,
                        type : "success",
                        text : "Paddler entered"
                      };
                      _this.dropdown = false;
                      _this.search = "";
                    })
                    .catch(e => {
                      // error message
                      console.log(e);
                      _this.$swal("Entry error", "The page will now refresh, please check and see what entries were submitted and correct any errors.", "error")
                        .then(() => {
                          this.$router.go();
                        })
                    })
                })
                .catch(e => {
                  //error message
                  _this.$swal("Entry error", "The page will now refresh, please check and see what entries were submitted and correct any errors.", "error")
                    .then(() => {
                      this.$router.go();
                    })
                  console.log(e);
                })
            }
          },
          // if a paddler entry is removed
          paddlerRemoved(index){
            let _this = this;
            // get boat id
            let boatID = _this.divRace[index].boatID;
            // send boat id to database for entry to be deleted
            _this.$http
              .post('/deleteentry', {
                boatid : boatID
              })
              .then(response => {
                // remove from local lists and force update component
                _this.divRace.splice(index, 1);
                _this.getRaceInfo(_this.raceView);
                _this.$forceUpdate();
              })
              .catch(e => {
                // error message
                console.log(e);
                _this.$swal("Failed to delete entry", "If the error persists please contact an administrator", "error");
              })

          },

        },
      watch: {
          // search function
        search: function() {
          let _this = this;
          // if search length is greater than 3
          if(_this.search.length >= 3){
            _this.message = {};
            _this.dropdown = true;
            // search database for term
            _this.$http
              .get('search?term=' + _this.search)
              .then(response => {
                _this.paddlerSearchResults = response.data.response;
                // if there are no results inform user
                if(_this.paddlerSearchResults.length === 0){
                  _this.message = {
                    show : true,
                    type : "danger",
                    text : "No search results"
                  };
                } else if (_this.paddlerSearchResults.length === 1){
                }
              })
              .catch(error => {
                // error message
                console.log(error)
                _this.$swal("Search error", "Please try again", "error");
              })
          } else {
            // close search dropdown
            _this.closeDropdown(
            );
          }
        },
      }
    }
</script>

<style scoped>
  .k2Table tr:nth-child(4n + 3), .k2Table tr:nth-child(4n+4) {
    background: rgb(72, 173, 111);
  }

 #raceorganiser {
   background-color: rgba(203, 205, 206, 0.3);
   height: 100%;
 }

 th, td {
   color: white;
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

  .raceView {
  }

  .raceView h2 {
    text-align: left;
  }

  .raceName {
    cursor: pointer;
  }

  .raceName:hover {
    color: darkblue !important;
  }

 @media only screen and (max-width: 767px) {
   .racesList {
     margin-top: 24px;
   }
 }

 @media only screen and (max-width: 991px) {
   .divisionList {
     margin-top: 0px;
     margin-left: 0px !important;
     margin-right: 5px !important;
   }
 }

  @media only screen and (max-width: 420px) {
    .xScroll {
      overflow-x: scroll;
    }
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
    cursor: pointer;
  }

  .minus {
    color: red;
    font-size: 28px;
  }

</style>
