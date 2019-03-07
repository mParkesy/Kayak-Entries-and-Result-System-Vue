<template>

    <div id="races">
      <b-container class="text-center mx-auto">
        <b-row class="col-lg-12 mx-auto pt-4 mt-0">
          <b-col>
            <b-dropdown :text="'Year: ' + selectYear" class="m-md-2">
              <b-dropdown-item v-for="year in years" :key="year.year" v-on:click="getRaces(year.year, selectRegion, '')"> <a class="mx-auto">{{ year.year }}</a></b-dropdown-item>
            </b-dropdown>
          </b-col>
          <b-col class="pl-0">
            <b-dropdown :text="'Region: ' + selectRegionName" class="m-md-2">
              <b-dropdown-item v-for="region in regions" :key="region.regionID" v-on:click="getRaces(selectYear ,region.regionID, region.regionName)"> <a class="mx-auto">{{ region.regionName }}</a></b-dropdown-item>
            </b-dropdown>
          </b-col>
        </b-row>

        <b-row class="col-lg-12 mx-auto mt-4">
          <table class="table table-bordered">
            <thead v-if="loading" class="thead-dark">
            <tr>
              <th scope="col">Race Name</th>
              <th scope="col">Year</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="race in info">
              <th>
                <router-link :to="{ name: 'raceresult', params: { id: race.raceID }}">
                  <a>{{ race.raceName }}</a>
                </router-link>
              </th>
              <th>{{ race.year }}</th>
            </tr>
            </tbody>
          </table>
        </b-row>
      </b-container>
      </div>
</template>

<script>

  export default {
    name: 'races',
    data () {
      return {
        info: [],
        errors: [],
        years: [],
        loading: false,
        regions: [],
        selectYear : 0,
        selectRegion: 0,
        selectRegionName: "",
      }
    },
    methods : {
      getRaces: function (year, region, name) {
        let _this = this;
        this.selectYear = year;
        this.selectRegion = region;
        let call = '/races';
        if(region !== 0 && region !== 11){
          call +=  "?year=" + year + "&region=" + region;
          this.selectRegionName = name;
        } else {
          call += "?year=" + year;
          this.selectRegionName = "All";
        }
        call += "&process=1"
        this.$http
          .get(call)
          .then(response => {
            this.loading = true;
            this.info = response.data.response;
            console.log(this.info);
            if(this.info.length == 0){
              this.selectYear--;
              this.getRaces(this.selectYear, this.selectRegion, this.selectRegionName);
            }
          })
          .catch(e => {
            this.errors.push(e)
            this.loading = false;
            _this.$swal("There was an error", "There are no race results to show.", "error");
          })
      }
    },
    created() {
      this.$http
          .get('/race_year')
          .then(response => {
            this.years = response.data.response;
            this.getRaces(this.years.slice(-1)[0].year, this.selectRegion);
            this.selectYear = this.years.slice(-1)[0].year;
            this.selectRegionName = "All"
          })
          .catch(e => {
            this.errors.push(e)
          }),
      this.$http
        .get('/regions')
        .then(response => {
          this.regions = response.data.response;
        })
        .catch(e => {
          this.errors.push(e)
        })


    }
  }


</script>

<style scoped>
  .year {
    cursor: pointer;
  }

  hr {
    width: 1px;
  }

/*  #races {
    background-color: rgb(228, 229, 231);
  }*/
</style>
