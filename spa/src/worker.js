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
  Axios.post('http://localhost:3000/isorganiser', {
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

export {sortRaces, isOrganiser}
