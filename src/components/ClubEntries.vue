<!--
  This page displays all the paddlers that have been entered into a race from a particular club.
  This is to be accessed by a race organiser.
-->

<template>
  <div id="clubentries">
    <b-container class="text-center mx-auto col-lg-10 mx-auto pt-4 scrollX">
      <b-row class="col-lg-12">
        <h2 style="text-align: left; font-size: 28px; font-weight: 600;"> {{ club.clubname }} </h2>
          <table class="table col-lg-12 mx-auto mt-2 results">
            <thead class="thead-dark">
            <tr>
              <th scope="col">Boat Number</th>
              <th scope="col">Name</th>
              <th scope="col">Class</th>
              <th scope="col">Div</th>
              <th scope="col">Paid?</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(result) in list" :key="result.raceID">
              <td align="center">
                {{ result.boatname }}
              </td>
              <td align="center">{{ result.name }}</td>
              <td align="center">{{ result.class }}</td>
              <td align="center">{{ result.division }}</td>
              <td align="center">
              </td>
            </tr>
            </tbody>
          </table>
      </b-row>
    </b-container>
  </div>
</template>


<script>
  import {isOrganiser, sortRaces} from "../worker";

    export default {
        name: "ClubEntries",
      data () {
        return {
          info: [],
          errors: [],
          race: [],
          racename: "",
          list : [],
          club : []
        }
      },
      // on creation of component get necessary details
      created() {
        let _this = this;
        // get all entries for club for this race
        _this.$http
          .get("/clubraceentries?raceid=" + _this.$route.params.id + "&clubid=" + _this.$route.params.club)
          .then(response => {
            _this.list = response.data.response;
            // reverse the list so higher division paddlers are first
            _this.list.reverse();
            _this.list.sort(function (a, b) {
              return parseInt(a.boatnumber) - parseInt(b.boatnumber);
            })
            // get the fulls details for the club
            _this.$http
              .get('club?id=' + _this.$route.params.club)
              .then(response => {
                _this.club = response.data.response[0];

              })
          })
          .catch(error => {
            _this.$swal("Failed to get club entries", "Please try again", "error");
            _this.errors.push(error);
            console.log(error);
          })

      },
      updated(){
          let _this = this;
          // if the club details are fully loaded in then show print view
          if(_this.club.clubname != null){
            window.print();
          }
      }
    }
</script>

<style scoped>
  .k2Table tr:nth-child(4n + 3), .k2Table tr:nth-child(4n+4) {
    background: rgb(200, 200, 200);
  }

  #clubentries {
    background-color: rgb(228, 229, 231);
  }

  @media only screen and (max-width: 730px) {
    .scrollX {
      overflow-x: scroll;
    }
  }
</style>
