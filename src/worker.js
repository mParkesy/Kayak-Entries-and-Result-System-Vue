import Axios from 'axios'

function sortRaces(list){
  let divRace = [];
  let rd = "";
  let result = [];
  for(let i = 0; i < list.length; i++){
    if(list[i].time === "NA"){
      list[i].position = "";
      list[i].points = "";
      list[i].pd = "";
      list[i].time = list[i].outcome;
    } else if (list[i].points === "NA"){
      list[i].points = "";
    }
    if (list[i].pd === "NA"){
      list[i].pd = "";
    }

    if(list[i].raceDivision === rd){
      divRace.push(list[i]);
    } else {
      divRace = [];
      divRace.push(list[i]);
      result.push(divRace);
    }
    rd = list[i].raceDivision;
  }
  for(let i = 0; i < result.length; i++){
    console.log(result[i]);
    result[i].sort(function (a, b) {
      return a.boatname - b.boatname;
    })
  }
  return result;
}


function isOrganiser(user, result){
  let x = 0;

  Axios.post('http://localhost:3000/isorganiser', {
    userID : user.userID
  })
    .then(response => {
      x = response.data.response[0].account;
    })
    .catch(error => {

    })
  result(x);
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
  console.log(list);
  console.log(number)
  for(let i = 0; i < list.length; i++){
    if(list[i].boatname == number){
     return true;
    }
  }
  return false;
}

function htmlDateToUK(date){
  return date.substring(8, 10) + "/" + date.substring(5, 7) + "/" + date.substring(0, 4);
}

function UKTohtmlDate(date){
  return date.substring(6, 10) + "-" + date.substring(3, 5) + "-" + date.substring(0, 2);
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

export {sortRaces, isOrganiser, splitOffsets, getSeconds, getTime, hmsToSeconds, secondsToHMS, includesBoatNumber, htmlDateToUK, UKTohtmlDate}
