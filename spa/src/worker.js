import Axios from 'axios'

function sortRaces(list){
  let divRace = [];
  let rd = "";
  let result = [];
  for(let i = 0; i < list.length; i++){
    //console.log("Loop: " + i);
    if(list[i].raceDivision === rd){
      //.log("before and after same");
      divRace.push(list[i]);
    } else {
      //console.log("different");
      divRace = [];
      divRace.push(list[i]);
      result.push(divRace);
    }
    rd = list[i].raceDivision;
  }
  return result;
}


function isOrganiser(user){
  let x = 0;
  Axios.post('http://192.168.0.47:3000/isorganiser', {
    userID : user.userID
  })
    .then(response => {
      console.log("hello")
      x = response.data.response[0].organiser;
      return x;
    })
    .catch(error => {
      return x;
    })
  return x;
}

function splitOffsets(list){
  let x = list.split(",");
  let l = [];
  for(let y = 0; y <x.length-1; y++){
    let element = x[y].split("-");
    l.push({
      div : element[0],
      time : element[1]
    })
  }
  return l;
}

// Convert H:M:S to seconds
// Seconds are optional (i.e. n:n is treated as h:s)
function hmsToSeconds(s) {
  var b = s.split(':');
  return b[0]*3600 + b[1]*60 + (+b[2] || 0);
}

// Convert seconds to hh:mm:ss
// Allow for -ve time values
function secondsToHMS(secs) {
  function z(n){return (n<10?'0':'') + n;}
  var sign = secs < 0? '-':'';
  secs = Math.abs(secs);
  return sign + z(secs/3600 |0) + ':' + z((secs%3600) / 60 |0) + ':' + z(secs%60);
}

function includesBoatNumber(list, number){
  for(let i = 0; i < list.length; i++){
    if(list[i].boatname === number){
     return true;
    }
  }
  return false;
}

/*function getTime(seconds){
  console.log(seconds / 60 / 60);
  console.log(seconds / 60);
}


function getSeconds(time){
  let timeList = time.split(":");
  let hh = timeList[0];
  let mm = timeList[1];
  let ss = timeList[2];

  hh = parseInt(hh) * 60 * 60;
  mm = parseInt(mm) * 60;
  return hh + mm + parseInt(ss);
}*/

export {sortRaces, isOrganiser, splitOffsets, getSeconds, getTime, hmsToSeconds, secondsToHMS, includesBoatNumber}
