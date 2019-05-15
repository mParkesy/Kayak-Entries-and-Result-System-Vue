import Axios from 'axios'

/**
 * Takes a list of race entries to be sorted into divisional races
 * @param list The list to be sorted
 * @returns {Array} An array of arrays containing each division and its results
 */
function sortRaces(list){
  let divRace = [];
  let rd = "";
  let result = [];
  // loop over all
  for(let i = 0; i < list.length; i++){
    // if not proper result then change fields
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
    // push onto the list if last division is same as current
    if(list[i].raceDivision === rd){
      divRace.push(list[i]);
    } else {
      // if not then create a new list and push to that list
      divRace = [];
      divRace.push(list[i]);
      result.push(divRace);
    }
    rd = list[i].raceDivision;
  }
  // sort each division list by boat number
  for(let i = 0; i < result.length; i++){
    result[i].sort(function (a, b) {
      return a.boatname - b.boatname;
    })
  }
  return result;
}

/**
 * Splits the offsets for division start times into an array
 * @param list The list of offsets as a string
 * @returns {Array} The array to return
 */
function splitOffsets(list){
  // split by comma
  let x = list.split(",");
  let l = [];
  // for all results
  for(let y = 0; y <x.length-1; y++){
    // split by -
    let element = x[y].split("-");
    // push to the list to return
    l.push({
      div : element[0],
      time : element[1]
    })
  }
  return l;
}

/**
 * Convert H:M:S to seconds
 * Seconds are optional (i.e. n:n is treated as h:s)
 * @param s The hms string
 * @returns {number} The string to number
 */
function hmsToSeconds(s) {
  var b = s.split(':');
  return b[0]*3600 + b[1]*60 + (+b[2] || 0);
}

/**
 * Convert seconds to hh:mm:ss
 * Allow for -ve time values
 * @param secs The time in seconds
 * @returns {string} String in format Hms
 */
function secondsToHMS(secs) {
  function z(n){return (n<10?'0':'') + n;}
  var sign = secs < 0? '-':'';
  secs = Math.abs(secs);
  return sign + z(secs/3600 |0) + ':' + z((secs%3600) / 60 |0) + ':' + z(secs%60);
}

/**
 * Checks to see if boat number is in list
 * @param list The list to check against
 * @param number The boat number to search for
 * @returns {boolean} True means in list, false not
 */
function includesBoatNumber(list, number){
  for(let i = 0; i < list.length; i++){
    if(list[i].boatname == number){
     return true;
    }
  }
  return false;
}

/**
 * Convert html date to UK format
 * @param date The date to be converted
 * @returns {string} The date converted as a string
 */
function htmlDateToUK(date){
  return date.substring(8, 10) + "/" + date.substring(5, 7) + "/" + date.substring(0, 4);
}

/**
 * Convert a UK date to html date
 * @param date The date to be converted
 * @returns {string} The converted as a string
 * @constructor
 */
function UKTohtmlDate(date){
  return date.substring(6, 10) + "-" + date.substring(3, 5) + "-" + date.substring(0, 2);
}


export {sortRaces, splitOffsets, hmsToSeconds, secondsToHMS, includesBoatNumber, htmlDateToUK, UKTohtmlDate}
