<template>
  <div id="runrace" class=" py-4">
    <b-container class="text-center mx-auto">
      <b-row class="col-lg-12 mx-auto mt-4">
        <h2>Running race: {{ race.raceName }}</h2>
      </b-row>
      <b-row class="col-lg-12 mx-auto mt-4">
        <b-col class="panel py-4" md="5" style="background-color: rgb(254, 193, 6);">
          <h3 class="pb-2">Enter stopwatch start times</h3>
          <b-form @submit="handle">
            <b-form-group v-for="(div, index) in divisions" :key="div.raceDivision"
              :id="div.raceDivision"
              :label="'Division ' + div.raceDivision"
            >
              <b-form-input v-model="form.divs[index]" type="time" step=""/>
            </b-form-group>
            <b-button type="submit" variant="primary">Submit</b-button>
          </b-form>
        </b-col>
        <b-col class="panel py-4 race" offset-md="1" md="6" style="background-color: rgb(32, 169, 215);">
          <h3 class="pb-2">Add paddler time</h3>
          <b-alert :show="message.show" :variant="message.type">{{ message.text }}</b-alert>
          <b-form-group label="Boat number">
            <b-form-input autofocus v-model="boatnumber" type="number" step="1"/>
          </b-form-group>
          <b-form-group label="Time" v-if="selected == 'Finish'">
            <b-form-input v-model="time" type="time" step="1"/>
          </b-form-group>
          <b-form-group label="">
            <b-form-radio-group v-model="selected" :options="options" name="radioInline" />
          </b-form-group>
          <b-button v-on:click="submitPaddlerTime()" type="submit" variant="primary">Submit</b-button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import { sortRaces, splitOffsets, hmsToSeconds, secondsToHMS, includesBoatNumber } from "../worker";

    export default {
      name: "RunRace",
      data () {
        return {
          race : [],
          divisions : [],
          form : {
            divs : []
          },
          boatnumber : "",
          selected : 'Finish',
          options: [
            { text: 'Finish', value: 'Finish'},
            { text: 'Did not start', value: 'DNS'},
            { text: 'Retired', value: 'RTD'}
          ],
          time : "00:00:00",
          allRaceResults : [],
          allBoatNumbers : [],
          message : []
        }
      },
      created(){
        let _this = this;
        _this.$http
          .get('/race?id=' + this.$route.params.id)
          .then(response => {
            _this.race = response.data.response[0];
            let divTimes = splitOffsets(_this.race.boatOffset);
            console.log(divTimes);
            for(let i = 0; i < divTimes.length; i++){
              _this.form.divs.push(divTimes[i].time);
            }
          })
          .catch(error => {
            _this.$swal("Failed to get race data", "Please try again", "error");
            console.log(error);
          }),
        _this.$http
          .get('/racedivisions?id=' + this.$route.params.id)
          .then(response => {
            _this.divisions = response.data.response;
          })
          .catch(error => {
            _this.$swal("Failed to get race divisions", "Please try again", "error");
          }),
          _this.$http
            .get('/raceresult_order?id=' + this.$route.params.id)
            .then(response => {
              _this.allRaceResults = response.data.response;
              for(let i = 0; i < _this.allRaceResults.length; i++) {
                _this.allBoatNumbers.push(_this.allRaceResults[i].boatname);
              }
            })
            .catch(error => {
              _this.$swal("Failed to get race divisions", "Please try again", "error");
            })
      },
      methods : {
        handle(evt){
          let _this = this;
          evt.preventDefault();
          console.log(_this.form);
          let list = "";
          for(let i = 0; i < _this.form.divs.length; i++){
           let value = _this.form.divs[i];
           list = list + _this.divisions[i].raceDivision + "-00:" + value + ",";
            /*
             _this.$http
               .post('/updateracedivision', {
                 time : value,
                 raceID : this.$route.params.id,
                 raceDivision : _this.divisions[i].raceDivision
               })
               .then(response => {
                 console.log(response.data.response);
               })
               .catch(error => {
                 _this.$swal("Failed to get submit stopwatch times", "Please try again", "error");
               })*/
          }
          _this.$http
            .post('/updateraceoffset', {
              list : list,
              raceID : this.$route.params.id
            })
            .then(response => {
              console.log(response.data.response);
              _this.$swal("Stopwatch offsets submitted", "Division start times have been submitted, you can now input finish times", "success");
            })
            .catch(error => {
              _this.$swal("Failed to submit stopwatch times", "Please try again", "error");
            })
        },
        submitPaddlerTime(){
          let _this = this;
          let div = _this.boatnumber[0];
          let list = splitOffsets(_this.race.boatOffset);
          let newTime = "";
          for(let i = 0; i < list.length; i++){
            console.log("Is: " + (div + 50));
            if(list[i].div === div || (list[i].div.includes("_") && parseInt(_this.boatnumber) > div + 50)){
              newTime = secondsToHMS(hmsToSeconds(_this.time) - hmsToSeconds(list[i].time));

            }
          }
          console.log(_this.allBoatNumbers);

          if(includesBoatNumber(_this.allBoatNumbers,_this.boatnumber)){
            _this.allBoatNumbers.splice(_this.allBoatNumbers.indexOf(_this.boatnumber), 1);
            console.log(_this.allBoatNumbers);
            _this.$http
              .post('/updateboatresult', {
                data : {
                  boatname : _this.boatnumber,
                  racetime : newTime,
                  outcome : _this.selected
                }
              })
              .then(response => {
                _this.message = {
                  show : true,
                  type : "success",
                  text : _this.boatnumber + " submitted"
                };
                _this.boatnumber = "";
                _this.time = "";
                _this.selected = "Finish";
              })
              .catch(error => {
                _this.message = {
                  show : true,
                  type : "danger",
                  text : _this.boatnumber + " failed to submit"
                };
              })
          } else {
            _this.message = {
              show : true,
              type : "danger",
              text : _this.boatnumber + " doesn't exist in the system"
            };
          }
        },
        getPDF(){
          let _this = this;
          let user = JSON.parse(localStorage.getItem('user'));
          _this.$http
            .get('/clubraceentries?raceid=' + this.$route.params.id + "&clubid=" + user.clubID)
            .then(response => {
              let row = response.data.response;
              console.log(row);
            })
            .catch(error => {
              _this.$swal("Failed to submit stopwatch times", "Please try again", "error");
            })
        }
      }
    }
</script>

<style scoped>
  #runrace {
    background-color: rgb(228, 229, 231);
  }

  .panel {
    border-radius: 10px;
    color: white;
  }

  @media only screen and (max-width: 767px) {
    .race {
      margin-top: 24px;
    }
  }



</style>
