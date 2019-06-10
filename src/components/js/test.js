import { sortRaces, splitOffsets, hmsToSeconds, secondsToHMS, includesBoatNumber } from "../../worker";
import NavBar from "../NavBar";

export default {
  name: "RunRace",
  components: {NavBar},
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
      raceBoatNumbers : [],
      submittedBoatNumbers : [],
      message : [],
      message2 : [],
      info: [],
      errors: [],
      results: [],
      textboxSubmission: "",
      inviteEmail : "",
      canView : false,
      resultsProcessed : false
    }
  },
  created(){
    let _this = this;
    // load a races details
    _this.loadRace(function() {
      // get all the boat numbers for a race
      _this.$http
        .get('/boatnumbers?id=' + _this.$route.params.id)
        .then(response => {
          _this.raceBoatNumbers = response.data.response;
          for(let i = _this.raceBoatNumbers.length -1; i >= 0; i--){
            if(_this.raceBoatNumbers[i] != null){
              if(_this.raceBoatNumbers[i].time != null){
                let x = {
                  boatname: _this.raceBoatNumbers[i].boatname
                };
                _this.submittedBoatNumbers.push(x);
                _this.raceBoatNumbers.splice(i, 1);
              }
            }

          }
        })
        .catch(error => {
          console.log(error);
          _this.$swal("Failed to get all boat numbers", "Please try again", "error");
        })
      // load all divisions in race and load results
      _this.loadDivisions();
      _this.loadResult();
      // get user from local storage
      let user = JSON.parse(localStorage.getItem('user'));
      // make sure user accessing this page owns the race
      if(_this.race.clubID == user.clubID){
        _this.canView = true;
      } else {
        // not allowed access
        _this.canView = false;
        _this.$swal("Access Denied", "You may not run this race", "error")
          .then(() => {
            window.location = "/raceorganiser";
          })
      }
    });
  },
  methods : {
    // load race function
    loadRace(callback) {
      let _this = this;
      // get race details
      _this.$http
        .get('/race?id=' + _this.$route.params.id)
        .then(response => {
          _this.race = response.data.response[0];
          // split offset stopwatch times
          let divTimes = splitOffsets(_this.race.boatOffset);
          // get list of divisions and add to list form stopwatch start time form
          if (divTimes.length != _this.form.divs.length) {
            for (let i = 0; i < divTimes.length; i++) {
              _this.form.divs.push(divTimes[i].time);
            }
          }
          callback();
        })
        .catch(error => {
          _this.$swal("Failed to get race data", "Please try again", "error");
          console.log(error);
        })
    },
    // load divisions
    loadDivisions() {
      let _this = this;
      // get divisions in race
      _this.$http
        .get('/racedivisions?id=' + this.$route.params.id)
        .then(response => {
          _this.divisions = response.data.response;
          _this.divisions.sort(function(a, b){
            return a.raceDivision - b.raceDivision;
          });
        })
        .catch(error => {
          _this.$swal("Error", "Failed to get race divisions", "error");
          console.log(error);
        })
    },
    // load race results
    loadResult() {
      let _this = this;
      // get race results in order
      _this.$http
        .get('/raceresult_order?id=' + _this.$route.params.id)
        .then(response => {
          let x = response.data.response;
          // sort the races into divisions
          _this.results = sortRaces(x);

        })
        .catch(e => {
          _this.errors.push(e)
          console.log(e)
          _this.$swal("Error", "Failed to get race results so far", "error");
        })
    },
    // stopwatch start times submit
    handleStopwatch(evt) {
      let _this = this;
      evt.preventDefault();
      let list = "";
      let missing = false;
      for (let i = 0; i < _this.divisions.length; i++) {
        let value = _this.form.divs[i];
        if (value === undefined || value == "") {
          value = "00:00";
          missing = true;
        }
        list = list + _this.divisions[i].raceDivision + "-" + value + ",";
      }

      // loop over form
/*      for (let i = 0; i < _this.form.divs.length; i++) {
        let value = _this.form.divs[i];
        // set value if undefined
        if (value === undefined || value == "") {
          value = "00:00:00";
        }
        // add to list of race start times in format
        list = list + _this.divisions[i].raceDivision + "-" + value + ",";

      }*/
      // send to database for update of race offsets
      _this.$http
        .post('/updateraceoffset', {
          list: list,
          raceID: _this.$route.params.id
        })
        .then(response => {
          // on success show message and update view
          _this.$swal("Stopwatch offsets submitted", "Division start times have been submitted, you can now input finish times", "success");
          _this.loadRace(function () {
            _this.loadDivisions();
            _this.loadResult();
            if(missing){
              _this.$swal("Stopwatch offset error", "A stopwatch offset was missing, please check again as it will have been set to 00:00", "error");
            }
          });
        })
        .catch(error => {
          console.log(error)
          _this.$swal("Failed to submit stopwatch times", "Please try again", "error");
        })


    },
    // time submitted for paddler
    submitTime(boatnumber, time) {
      let _this = this;
      console.log("Form length: " + _this.form.divs.length);
      console.log("Divison length: " + _this.divisions.length);
      if(_this.form.divs.length === 0 || (_this.form.divs.length != _this.divisions.length)) {
        _this.$swal("No stopwatch offsets", "Please enter stopwatch offsets before entering times", "error")
      } else {
        // check boat number is not empty
        if (boatnumber == "") {
          _this.message = {
            show: true,
            type: "danger",
            text: "Boat number cannot be empty"
          };
        } else {
          // get boat number division
          let div = boatnumber[0];
          let list = splitOffsets(_this.race.boatOffset);
          let newTime = "";
          // loop over offsets
          for (let i = 0; i < list.length; i++) {
            // if div in offset list is div for boat number or its a k2 and outcome is finish then
            /*          console.log("Current Div in list:" + list[i].div);
                      console.log("Paddler Div:" + div);
                      console.log("Boat number:" + boatnumber);
                      console.log("Div + 50:" + div + 50);
                      console.log("Div type: " + typeof(data));
                      console.log("Finish type: " + _this.selected);*/
            if ((list[i].div === div || (list[i].div === (div + "_" + div) && parseInt(boatnumber) > div + 50)) && (_this.selected === "Finish")) {
              // calculate new time from offset
              newTime = secondsToHMS(hmsToSeconds(time) - hmsToSeconds(list[i].time));
              // if outcome wasn't finish
            } else if (_this.selected === "RTD") {
              // set as retired
              newTime = "RTD";
            } else if (_this.selected === "DNS") {
              newTime = "DNS";
            }
          }
          let inList = false;
          let submitList = false;
          // check boat number is in list
          if (includesBoatNumber(_this.raceBoatNumbers, boatnumber)) {
            inList = true;
            // check to see if time already submitted
          } else if (includesBoatNumber(_this.submittedBoatNumbers, boatnumber)) {
            submitList = true;
            // not in list? doesn't exist
          } else {
            _this.message = {
              show: true,
              type: "danger",
              text: boatnumber + " doesn't exist in the system"
            };
          }
          // if in a list
          if (inList || submitList) {
            // update boat time with new values
            _this.$http
              .post('/updateboattime', {
                data: {
                  boatname: boatnumber,
                  racetime: newTime,
                  outcome: _this.selected,
                  raceID: _this.$route.params.id
                }
              })
              .then(response => {
                // if success and in list then remove from list
                if (inList) {
                  let pos = _this.raceBoatNumbers.map(function(e) { return e.boatname; }).indexOf(boatnumber);
                  _this.raceBoatNumbers.splice(pos, 1);
                  let data = {
                    boatname: _this.boatnumber
                  };
                  // add to submitted list instead
                  _this.submittedBoatNumbers.push(data);
                  _this.message = {
                    show: true,
                    type: "success",
                    text: boatnumber + " submitted"
                  };
                  // if in submitted list then inform user boat time was overwritten
                } else if (submitList) {
                  _this.message = {
                    show: true,
                    type: "success",
                    text: boatnumber + " time has been overwritten"
                  };
                }
                // set values back to blank
                _this.boatnumber = "";
                _this.time = "";
                _this.selected = "Finish";
                _this.loadResult();
              })
              .catch(error => {
                _this.message = {
                  show: true,
                  type: "danger",
                  text: boatnumber + " failed to submit"
                };
              })
          }
        }
      }
    },
    // another way to submit a boat time
    submitPaddlerTime() {
      let _this = this;
      _this.submitTime(_this.boatnumber, _this.time);
      /*      let _this = this;
            let div = _this.boatnumber[0];
            let list = splitOffsets(_this.race.boatOffset);
            let newTime = "";
            // loop over offsets
            for(let i = 0; i < list.length; i++){
              // if div in offset list is div for boat number or its a k2 and outcome is finish then
              if((list[i].div === div || (list[i].div.includes("_") && parseInt(_this.boatnumber) > div + 50)) && (_this.selected === "Finish")){
                // calculate new time from offset
                newTime = secondsToHMS(hmsToSeconds(_this.time) - hmsToSeconds(list[i].time));
                // if outcome wasnt finish
              } else if (_this.selected === "RTD") {
                // set as retired
                newTime = "RTD";
              } else if (_this.selected === "DNS"){
                newTime = "DNS";
              }
            }

            let inList = false;
            let submitList = false;
            if(includesBoatNumber(_this.raceBoatNumbers, _this.boatnumber)) {
              inList = true;
            } else if (includesBoatNumber(_this.submittedBoatNumbers, _this.boatnumber)){
              submitList = true;
            } else {
              _this.message = {
                show : true,
                type : "danger",
                text : _this.boatnumber + " doesn't exist in the system"
              };
            }
            if(inList || submitList){
              _this.$http
                .post('/updateboattime', {
                  data : {
                    boatname : _this.boatnumber,
                    racetime : newTime,
                    outcome : _this.selected
                  }
                })
                .then(response => {
                  if(inList){
                    _this.raceBoatNumbers.splice(_this.raceBoatNumbers.indexOf(_this.boatnumber), 1);
                    let data = {
                      boatname : _this.boatnumber
                    };
                    _this.submittedBoatNumbers.push(data);
                    _this.message = {
                      show : true,
                      type : "success",
                      text : _this.boatnumber + " submitted"
                    };
                  } else if (submitList){
                    _this.message = {
                      show : true,
                      type : "success",
                      text : _this.boatnumber + " time has been overwritten"
                    };
                  }

                  _this.boatnumber = "";
                  _this.time = "";
                  _this.selected = "Finish";
                  _this.loadResult();
                })
                .catch(error => {
                  _this.message = {
                    show : true,
                    type : "danger",
                    text : _this.boatnumber + " failed to submit"
                  };
                })
            }*/
    },
    // for text box large submissions
    handleModal(evt) {
      evt.preventDefault();
      let _this = this;
      // make sure data has been entered
      if (_this.textboxSubmission.length > 0) {
        // split line by line
        let list = _this.textboxSubmission.split('\n');
        // then split by comma
        for (let i = 0; i < list.length; i++) {
          let line = list[i].split(',');
          // get rid of any spaces
          line[1] = line[1].replace(/\s+/g, '');
          // set appropriate finish type
          if (line[1] == "RTD") {
            _this.selected = "RTD";
          } else if (line[1] == "DNS") {
            _this.selected = "DNS"
          } else {
            _this.selected = "Finish";
          }
          // submit the time using function
          _this.submitTime(line[0], line[1]);
        }
        // close modal
        _this.$nextTick(() => {
          // Wrapped in $nextTick to ensure DOM is rendered before closing
          _this.$refs.textModal.hide();
          _this.$swal("Submitted", "Paddler times have all been submitted", "success")
        })
      } else {
        // close modal if no data in text box
        _this.$nextTick(() => {
          // Wrapped in $nextTick to ensure DOM is rendered before closing
          _this.$refs.textModal.hide();
        })
      }
    },
    // email user to submit times on phone
    finishPhone(evt) {
      evt.preventDefault();
      let _this = this;
      // no email address provided
      if (!_this.inviteEmail) {
        _this.message2 = {
          show: true,
          type: "danger",
          text: "No email address"
        };
        // check validation of email
      } else if (!_this.validEmail(_this.inviteEmail)) {
        _this.message2 = {
          show: true,
          type: "danger",
          text: "Invalid email address"
        };
        // if email address is fine
      } else {
        // insert access token in database for this phone user
        _this.$http
          .post('/insertAccess', {
            data: {
              email: _this.inviteEmail,
              access: 0,
              raceid: this.$route.params.id,
              accessType: 0
            }
          })
          .then(response => {
            // close the modal when done
            _this.$nextTick(() => {
              // Wrapped in $nextTick to ensure DOM is rendered before closing
              _this.$refs.textPhone.hide();
              _this.$swal("Email Sent", "The email was successfully sent", "success")
            })
          })
          // on error
          .catch(error => {
            _this.$swal("Failed", "Failed to send email", "error")
            console.log(error);
          })
      }
    },
    // submit results to advisor
    submitAdvisor() {
      let _this = this;
      let data = {
        process: 1,
        raceID: _this.$route.params.id,
        region: _this.race.regionID
      }
      // update race process to 1, this will then send the email to advisor
      _this.$http
        .post('/updateraceprocess', {
          data: data
        })
        .then(response => {
          _this.$swal("Success", "Race updates complete", "success")
            .then(() => {

            })
        })
    },
    // process race results
    processResults() {
      let _this = this;
      let noTimeList = [];
      // build a list of boats that don't have times
      for (let i = 0; i < _this.raceBoatNumbers.length; i++) {
        console.log(_this.raceBoatNumbers[i].time + " : " + _this.raceBoatNumbers[i].boatname);
        if (_this.raceBoatNumbers.time == null) {
          noTimeList.push(_this.raceBoatNumbers[i]);
        }
      }

      // if the list has contents
      if (noTimeList.length > 0) {
        // build a warning of what boats need results
        let sweetText = "Boat times are missing for the following boats:<br>";
        for (let x = 0; x < noTimeList.length; x++) {
          sweetText = sweetText + noTimeList[x].boatname + "<br>";
        }
        // display warning
        _this.$swal("Boat times missing.",
          sweetText, "error");
      } else {
        // if all times then send process results function
        let data = {
          raceID: this.$route.params.id,
          processType: 0
        }
        _this.$http
          .post('/processresults', {
            data: data
          })
          .then(response => {
            _this.$swal("Success", "Race processed", "success")
              .then(() => {
                _this.resultsProcessed = true;
                _this.loadRace(function() {
                  _this.loadResult();
                });
              })
          })
          // check error type
          .catch(error => {
            if (error.response.status == 428) {
              _this.$swal("Time error", "Not all paddler times are filled in", "error");
            } else if (error.response.status == 400) {
              _this.$swal("Processing error", "Please try again soon and make sure all details are filled in", "error");
            } else {
              _this.$swal("Fail", "Failed to process results, please try again", "error");
            }

          })
      }
    },
    // valid email checker
    validEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
  }
}
