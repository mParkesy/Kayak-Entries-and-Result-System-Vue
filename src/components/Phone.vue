<!--
  For use when someone is invited to help input results and the page link is sent via email.
-->

<template>
  <div id="phone" class="pt-1 pb-5">
    <b-container class="mx-auto">
      <b-row class="col-lg-12 mt-4">
        <b-col class="py-1" md="8">
          <h2 class="mb-0" style="text-align: left">Race Results Processing for: {{ race.raceName }}</h2>
        </b-col>
      </b-row>
      <b-row class="col-lg-12 mx-auto mt-4">
        <b-col class="panel py-2" md="12" style="background-color: rgb(254, 193, 6);">
          <p>
            Paddler boat numbers and times should be entered in one long list.<br>
            This is an alternative to
            entering them one by one on each page.<br>
            The format of this entry should be:<br>
            {boatnumber}, {time in hh:mm:ss},<br>
            {boatnumber}, {time in hh:mm:ss},
          </p>
          <b-form-textarea
            placeholder="{boatnumber}, {time in hh:mm:ss},"
            rows="10"
            max-rows="100"
            v-model="textboxSubmission"
          ></b-form-textarea>
          <b-button class="m-1 mt-2" v-on:click="submitTimes" type="submit" variant="primary">Submit</b-button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>

  import {hmsToSeconds, secondsToHMS, splitOffsets} from "../worker";

    export default {
      name: "Phone",
      data () {
        return {
          race : [],
          access : [],
          textboxSubmission : "",
          selected : "Finish",
          raceBoatNumbers : [],
        }
      },
      // when the component is created
      created() {
        let _this = this;
        // check that the parameter in the url allows the user access
        _this.$http
          .get('/accesspage?id=' + _this.$route.params.id)
          .then(response => {
            _this.access = response.data.response[0];
            // if they don't have access show alert and sent to homepage
            if(_this.access.accessType != 0){
              _this.$swal("Access Denied", "You may not access this page.", "error")
                .then(() => {
                  _this.$router.push('/')
                })
            } else {
              // if they do have acces get race details and allow display of page
              _this.$http
                .get('/race?id='  + _this.access.raceID)
                .then(response => {
                  _this.race = response.data.response[0];
                  _this.$http
                    .get('/boatnumbers?id=' + _this.access.raceID)
                    .then(response => {
                      _this.raceBoatNumbers = response.data.response;
                    })
                    .catch(error => {
                      console.log(error);
                      _this.$swal("Failed to get all boat numbers", "Please try again", "error");
                    })
                })
                .catch(error => {
                  _this.$swal("Failed to get race data", "Please try again", "error");
                  console.log(error);
                })
            }
          })
          .catch(error => {
            _this.$swal("Access Denied", "You may not access this page.", "error");
            console.log(error);
          })
      },
      methods : {
        // submits times to the back end
        submitTimes(evt){
          let _this = this;
          try {
            evt.preventDefault();
            let wrongList = [];
            if(_this.textboxSubmission.length > 0){
              let list = _this.textboxSubmission.split('\n');
              let exist = true;
              for(let i = 0; i < list.length; i++){
                let line = list[i].split(',');
                line[1] = line[1].replace(/\s+/g, '');
                if(line[1] == "RTD"){
                  _this.selected = "RTD";
                } else if(line[1] == "DNS"){
                  _this.selected = "DNS"
                } else {
                  _this.selected = "Finish";
                }
                let boatnumber = line[0];
                let div = boatnumber[0];
                let offsetlist = splitOffsets(_this.race.boatOffset);
                let newTime = "";
                for(let x = 0; x < offsetlist.length; x++){
                  // if div in offset list is div for boat number or its a k2 and outcome is finish then
                  if((offsetlist[x].div === div || (offsetlist[x].div === (div + "_" + div) && parseInt(boatnumber) > div + 50)) && (_this.selected === "Finish")){
                    // calculate new time from offset
                    newTime = secondsToHMS(hmsToSeconds(line[1]) - hmsToSeconds(offsetlist[x].time));
                    // if outcome wasnt finish
                  } else if (_this.selected === "RTD") {
                    // set as retired
                    newTime = "RTD";
                  } else if (_this.selected === "DNS"){
                    newTime = "DNS";
                  }

                  for (let i = 0; i < _this.raceBoatNumbers.length; i ++){
                    if(_this.raceBoatNumbers[i].boatname == boatnumber){
                      _this.$http
                        .post('/updateboattime', {
                          data: {
                            boatname: boatnumber,
                            racetime: newTime,
                            outcome: _this.selected,
                            raceID: _this.access.raceID
                          }
                        })
                        .then(response => {
                          _this.$swal("Success", "Data has been processed", "success")
                          _this.textboxSubmission = "";
                        })
                        .catch(error => {
                          console.log(error);
                          this.textboxSubmission = "";
                          _this.$swal("Error", "Failed to process the data", "error")
                        })
                      exist = true;
                    } else {
                      exist = false;
                    }
                  }
                }
                if(!exist){
                  wrongList.push(boatnumber);
                }
              }
              if(wrongList.length > 0){
                let sweetText = "Boat numbers were incorrect for the following:<br>";
                for (let x = 0; x < wrongList.length; x++) {
                  sweetText = sweetText + wrongList[x] + "<br>";
                }
                // display warning
                _this.$swal("Incorrect/unknown boat times.",
                  sweetText, "error");
              }

            } else {
              _this.$swal("Error", "You must enter something in the text box", "error")
              this.textboxSubmission = "";
            }
            _this.textboxSubmission = "";
          } catch(e) {
            _this.$swal("Error", "There was an error in some of your typing, please try again", "error")
            this.textboxSubmission = "";
          }

        }
      }
    }
</script>

<style scoped>
  #phone {
    background-color: rgb(228, 229, 231);
    height: 100%;
  }
</style>
