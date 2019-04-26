<template>
  <div id="adminresult">
    <b-container class="text-center mx-auto col-lg-10 mx-auto pt-4 scrollX">
      <b-row class="col-lg-12">
        <h1> {{ racename }}</h1>
      </b-row>
      <b-form @submit="handleSubmit">
      <b-row v-for="(result, index) in race" :key="result.raceID" class="col-lg-12">
        <h2 style="text-align: left; font-size: 28px; font-weight: 600;"> Div {{ result[0].raceDivision }} </h2>
          <table class="table col-lg-12 mx-auto mt-2 results" v-bind:class="result[0].raceDivision.includes('_') ? ' k2Table ' : {} ">
            <thead class="thead-dark">
            <tr>
              <th scope="col">Position</th>
              <th scope="col">Name</th>
              <th scope="col">Club</th>
              <th scope="col">Class</th>
              <th scope="col">Div</th>
              <th scope="col">Time</th>
              <th scope="col">Points</th>
              <th scope="col">P/D</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="isRegional" v-for="(line, x) in result">
              <td align="center">
                <b-form-input
                  v-model="editForm[x].position"
                  type="text"
                  style="width: 50px"
                  size="3"
                ></b-form-input>
              </td>
              <td align="center">{{ line.name }}</td>
              <td align="center">{{ line.clubcode }}</td>
              <td align="center">{{ line.class }}</td>
              <td align="center">{{ line.division }}</td>
              <td align="center">
                <b-form-input
                  v-model="editForm[x].time"
                  type="text"
                  style="width: 100px"
                ></b-form-input>
              </td>
              <td align="center">{{ line.points }}</td>
              <td align="center">
                <b-form-input
                  v-model="editForm[x].pd"
                  type="text"
                  style="width: 50px"
                ></b-form-input>
              </td>
            </tr>
            <tr v-if="isOrganiser" v-for="line in result">
              <td>{{ line.position }}</td>
              <td>{{ line.name }}</td>
              <td>{{ line.clubcode }}</td>
              <td>{{ line.class }}</td>
              <td>{{ line.division }}</td>
              <td>{{ line.time }}</td>
              <td>{{ line.points }}</td>
              <td>{{ line.pd }}</td>
            </tr>
            </tbody>
          </table>
      </b-row>
        <b-button v-if="isRegional" class="mb-4" size="lg" variant="primary" type="submit">Submit</b-button>
      </b-form>
    </b-container>
  </div>
</template>


<script>
  import {isOrganiser, sortRaces} from "../worker";

    export default {
        name: "AdminResult",
      data () {
        return {
          info: [],
          errors: [],
          race: [],
          racename: "",
          editForm: [],
          isRegional : false,
          access : [],
          isOrganiser : false
        }
      },
      created() {
        let _this = this;
        let user = JSON.parse(localStorage.getItem('user'));
        let organiser = false;
        if(user != null){
          _this.$http.post('/isorganiser', {
            userID : user.userID
          })
            .then(response => {
              let organiser_check = response.data.response[0];
              if(organiser_check.account > 0) {
                _this.isOrganiser = true;
              }

              if(_this.$route.query.auth != undefined){
                let auth = _this.$route.query.auth;
                _this.$http
                  .get('/accesspage?id=' + auth)
                  .then(response => {
                    _this.access = response.data.response[0];
                    if(_this.access.accessType == 1){
                      _this.isRegional = true;
                      _this.isOrganiser = false;
                    } else {
                      _this.$swal("Access Denied", "You may not access this page.", "error")
                        .then(() => {
                          this.$router.push('/')
                        })
                    }
                  })
                  .catch(error => {
                    _this.$swal("Access Denied", "You may not access this page.", "error")
                      .then(() => {
                        this.$router.push('/')
                      })
                    console.log(error);
                  })
              } else if (!this.isOrganiser) {
                _this.$swal("Access Denied", "You may not access this page.", "error")
                  .then(() => {
                    this.$router.push('/')
                  })
              }
            })
            .catch(error => {
              _this.$swal("Error","Failed to authenticate user, you might need to login again", "error")
            })
        }

        _this.$http
          .get('/raceresult_order?id=' + _this.$route.params.id)
          .then(response => {
            _this.info = response.data.response;
            for(let i = 0; i < _this.info.length; i++){
              _this.editForm.push(_this.info[i]);
            }
            _this.race = sortRaces(_this.info);
          })
          .catch(e => {
            _this.errors.push(e)
          }),
          _this.$http
            .get('/race?id=' + _this.$route.params.id)
            .then(response => {
              let result = response.data.response;
              _this.racename = result[0].raceName;
            })
            .catch(e => {
              _this.errors.push(e)
            })
      },
      methods : {
          handleSubmit(e){
            let _this = this;
            e.preventDefault();
            let update = [];
            for(let i = 0; i < _this.editForm.length; i++){
              update.push({
                raceID : _this.$route.params.id,
                position : _this.editForm[i].position,
                time : _this.editForm[i].time,
                pd : _this.editForm[i].pd,
                boatname : this.editForm[i].boatname
              })
            }
            _this.$http.post('/mass_updateboatresult', {
              data : update
            })
              .then(response => {
                let data = {
                  process : 2,
                  raceID : _this.$route.params.id,
                }
                _this.$http
                  .post('/updateraceprocess', {
                    data : data
                  })
                  .then(response => {
                    let data = {
                      raceID : this.$route.params.id
                    }
                    _this.$http
                      .post('/processresults' , {
                        data : data
                      })
                      .then(response => {
                        _this.$swal("Success", "Race updates complete", "success")
                        .then(() => {

                        })
                        console.log(response);
                      })
                      .catch(error => {
                        _this.$swal("Fail", "Failed to process results, please try again", "error");
                      })

                  })

              })
          }
      }
    }
</script>

<style scoped>
  .k2Table tr:nth-child(4n + 3), .k2Table tr:nth-child(4n+4) {
    background: rgb(200, 200, 200);
  }

  #adminresult {
    background-color: rgb(228, 229, 231);
  }


  @media only screen and (max-width: 730px) {
    .scrollX {
      overflow-x: scroll;
    }
  }
</style>
