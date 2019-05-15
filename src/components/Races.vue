<!--
  The races component which shows all the races based on the filter provided, either year or region or both.
-->

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
            <thead class="thead-dark">
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
        regions: [],
        selectYear : 0,
        selectRegion: 0,
        selectRegionName: "",
      }
    },
    methods : {
      getRaces: function (year, region, name) {
        let _this = this;
        _this.selectYear = year;
        _this.selectRegion = region;
        let call = '/races';
        if(region !== 0 && region !== 11){
          call +=  "?year=" + year + "&region=" + region;
          _this.selectRegionName = name;
        } else {
          call += "?year=" + year;
          _this.selectRegionName = "All";
        }
        call += "&process=2"
        _this.$http
          .get(call)
          .then(response => {
            _this.info = response.data.response;
            if(_this.info.length == 0){
              _this.selectYear--;
              _this.selectRegion = 11;
              _this.selectRegionName = "ALL";
              _this.getRaces(_this.selectYear, _this.selectRegion, _this.selectRegionName);
              _this.$swal("No results", "There were no results for that search filter", "error");
            } else {
            }
          })
          .catch(e => {
            // error getting filter info
            _this.errors.push(e)
            console.log(e)
            _this.$swal("There was an error", "There are no race results to show.", "error");
          })
      }
    },
    created() {
      let _this = this;
      // get current race year
      _this.$http
          .get('/race_year')
          .then(response => {
            _this.years = response.data.response;
            // get races in that race year with default region
            _this.getRaces(_this.years.slice(-1)[0].year, _this.selectRegion);
            _this.selectYear = _this.years.slice(-1)[0].year;
            _this.selectRegionName = "All"
          })
          .catch(e => {
            console.log(e)
            _this.$swal("Race result error", "Please reload the page", "error");
            _this.errors.push(e)
          }),
        // get the list of regions for the filter
        _this.$http
        .get('/regions')
        .then(response => {
          _this.regions = response.data.response;
        })
        .catch(e => {
          console.log(e)
          // error getting regions
          _this.$swal("Race result error", "Please reload the page", "error");
          _this.errors.push(e)
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

</style>
