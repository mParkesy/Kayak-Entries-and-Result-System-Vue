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
      info: [],
      errors: [],
      results: [],
      textboxSubmission: "",
      inviteEmail : "",
      canView : false
    }
  },
  created(){
    let _this = this;
    _this.loadRace(function() {
      _this.$http
        .get('/boatnumbers?id=' + _this.$route.params.id)
        .then(response => {
          _this.raceBoatNumbers = response.data.response;
        })
        .catch(error => {
          console.log(error);
          _this.$swal("Failed to get all boat numbers", "Please try again", "error");
        })
      _this.loadDivisions();
      _this.loadResult();
      let user = JSON.parse(localStorage.getItem('user'));

      if(_this.race.clubID == user.clubID){
        _this.canView = true;
      } else {
        _this.canView = false;
        _this.$swal("Access Denied", "You may not run this race", "error")
          .then(() => {
            window.location = "/raceorganiser";
          })
      }
     /* let points = {
        regionID : _this.raceView.regionID,
        clubID : _this.raceView.clubID,
        points : 0,
        raceID : _this.raceView.raceID
      }
      _this.$http
        .post('/insertclubpoints', {
          data : points
        })
        .then(reponse => {

        })
        .catch(error => {
          _this.$swal("Failed to assign boat numbers", error.response.data, "error");
          _this.errors.push(e)
        })*/

    });
  },
  methods : {
    loadRace(callback){
      let _this = this;
      _this.$http
        .get('/race?id=' +_this.$route.params.id)
        .then(response => {
          _this.race = response.data.response[0];
          console.log(_this.race)
          let divTimes = splitOffsets(_this.race.boatOffset);

          if(divTimes.length != _this.form.divs.length){
            for(let i = 0; i < divTimes.length; i++){
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
    loadDivisions(){
      let _this = this;
      _this.$http
        .get('/racedivisions?id=' + this.$route.params.id)
        .then(response => {
          _this.divisions = response.data.response;
          /*_this.divisions.sort(function(a, b){
            var x = a.raceDivision.toLowerCase();
            var y = b.raceDivision.toLowerCase();
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
          });*/
        })
        .catch(error => {
          _this.$swal("Failed to get race divisions", "Please try again", "error");
          console.log(error);
        })
    },
    loadResult(){
      let _this = this;
      _this.$http
        .get('/raceresult_order?id=' + _this.$route.params.id)
        .then(response => {
          let x = response.data.response;
          _this.results = sortRaces(x);
        })
        .catch(e => {
          _this.errors.push(e)
        })
    },
    handleStopwatch(evt){
      let _this = this;
      evt.preventDefault();
      let list = "";
      console.log(_this.form.divs);
      for(let i = 0; i < _this.form.divs.length; i++){
        let value = _this.form.divs[i];
        if(value === undefined){
          value = "00:00";
        }
        console.log(_this.divisions)
        list = list + _this.divisions[i].raceDivision + "-" + value + ",";

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
          raceID : _this.$route.params.id
        })
        .then(response => {
          _this.$swal("Stopwatch offsets submitted", "Division start times have been submitted, you can now input finish times", "success");
          _this.loadRace(function() {
            _this.loadDivisions();
            _this.loadResult();
          });
        })
        .catch(error => {
          console.log(error)
          _this.$swal("Failed to submit stopwatch times", "Please try again", "error");
        })


    },
    submitTime(boatnumber ,time){
      let _this = this;
      if(boatnumber == ""){
        _this.message = {
          show : true,
          type : "danger",
          text : "Boat number cannot be empty"
        };
      } else {
        console.log(boatnumber)
        let div = boatnumber[0];
        let list = splitOffsets(_this.race.boatOffset);
        let newTime = "";
        // loop over offsets
        for(let i = 0; i < list.length; i++){
          // if div in offset list is div for boat number or its a k2 and outcome is finish then
          if((list[i].div === div || (list[i].div.includes("_") && parseInt(boatnumber) > div + 50)) && (_this.selected === "Finish")){
            // calculate new time from offset
            newTime = secondsToHMS(hmsToSeconds(time) - hmsToSeconds(list[i].time));
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
        if(includesBoatNumber(_this.raceBoatNumbers, boatnumber)) {
          inList = true;
        } else if (includesBoatNumber(_this.submittedBoatNumbers, boatnumber)){
          submitList = true;
        } else {
          _this.message = {
            show : true,
            type : "danger",
            text : boatnumber + " doesn't exist in the system"
          };
        }
        if(inList || submitList){
          _this.$http
            .post('/updateboattime', {
              data : {
                boatname : boatnumber,
                racetime : newTime,
                outcome : _this.selected
              }
            })
            .then(response => {
              if(inList){
                _this.raceBoatNumbers.splice(_this.raceBoatNumbers.indexOf(boatnumber), 1);
                let data = {
                  boatname : _this.boatnumber
                };
                _this.submittedBoatNumbers.push(data);
                _this.message = {
                  show : true,
                  type : "success",
                  text : boatnumber + " submitted"
                };
              } else if (submitList){
                _this.message = {
                  show : true,
                  type : "success",
                  text : boatnumber + " time has been overwritten"
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
                text : boatnumber + " failed to submit"
              };
            })
        }
      }

    },
    submitPaddlerTime(){
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
    handleModal(evt){
      evt.preventDefault();
      let _this = this;
      if(_this.textboxSubmission.length > 0){
        let list = _this.textboxSubmission.split('\n');
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
          _this.submitTime(line[0], line[1]);
        }
        _this.$nextTick(() => {
          // Wrapped in $nextTick to ensure DOM is rendered before closing
          _this.$refs.textModal.hide();
          _this.$swal("Submitted", "Paddler times have all been submitted", "success")
        })
      } else {
        _this.$nextTick(() => {
          // Wrapped in $nextTick to ensure DOM is rendered before closing
          _this.$refs.textModal.hide();
        })
      }
    },
    finishPhone(evt){
      evt.preventDefault();
      let _this = this;

      if (!_this.inviteEmail) {
        _this.message = {
          show : true,
          type : "danger",
          text : "No email address"
        };
      } else if (!_this.validEmail(_this.inviteEmail)){
        _this.message = {
          show : true,
          type : "danger",
          text : "Invalid email address"
        };
      } else {
        _this.$http
          .post('/insertAccess', {
            data : {
              email : _this.inviteEmail,
              access : 0,
              raceid : this.$route.params.id,
              accessType : 0
            }
          })
          .then(response => {
            _this.$nextTick(() => {
              // Wrapped in $nextTick to ensure DOM is rendered before closing
              _this.$refs.textModal.hide();
              _this.$swal("Email Sent", "The email was successfully sent", "success")
            })
          })
          .catch(error => {
            _this.$swal("Failed", "Failed to send email", "error")
          })
      }
    },
    submitAdvisor(){
      let _this = this;
      console.log(_this.race.regionID)
      let data = {
        process : 1,
        raceID : _this.$route.params.id,
        region : _this.race.regionID
      }
      _this.$http
        .post('/updateraceprocess' , {
          data : data
        })
        .then(response => {
          _this.$swal("Success", "Race updates complete", "success")
            .then(() => {

            })
        })
    },
    processResults(){
      let _this = this;
      let data = {
        raceID : this.$route.params.id,
        processType : 0
      }
      _this.$http
        .post('/processresults' , {
          data : data
        })
        .then(response => {
          console.log(response);
          _this.$swal("Success", "Race processed", "success")
        })
        .catch(error => {
          if(error.response.status == 428){
            _this.$swal("Time error", "Not all paddler times are filled in", "error");
          } else if (error.response.status == 400){
            _this.$swal("Processing error", "Please try again soon and make sure all details are filled in", "error");
          } else {
            _this.$swal("Fail", "Failed to process results, please try again", "error");
          }

        })
    },
    validEmail(email){
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
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
