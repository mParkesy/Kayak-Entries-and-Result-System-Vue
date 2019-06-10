<!--
  This is the page where a paddler can be search additional details and statistics.
-->

<template>
  <div id="paddler" class="col-lg-8 mx-auto pt-4">
    <h2 class="mb-3 title">Paddler Statistics</h2>
    <p class="text-left">Search for a paddler to view their statistics.</p>
    <b-form-input v-model="search"
                  type="search"
                  placeholder="Search for a paddler" autocomplete="off"></b-form-input>

    <b-list-group class="paddlerList" v-if="dropdown">
      <b-list-group-item  class="paddler" v-for="paddler in paddlers" :key="paddler.paddlerID" @click="handlePaddler(paddler)">{{ paddler.name }}</b-list-group-item>
    </b-list-group>

    <b-card v-if="paddlerClicked" class="mt-4">
      <h4 class="m-0" slot="header">{{ stats.name }}</h4>
      <b-list-group class="p-0" flush>
        <b-list-group-item>Current Division: {{ currentPaddler.division }}</b-list-group-item>
        <b-list-group-item>Races Entered: {{ stats.racesEntered }}</b-list-group-item>
        <b-list-group-item>Retirements: {{ stats.retirements }}</b-list-group-item>
        <b-list-group-item>Did not starts: {{ stats.notStart }}</b-list-group-item>
        <b-list-group-item>First places: {{ stats.first }}</b-list-group-item>
        <b-list-group-item>Second places: {{ stats.second }}</b-list-group-item>
        <b-list-group-item>Third places: {{ stats.third }}</b-list-group-item>
        <b-list-group-item>Podium Finishes: {{ stats.first + stats.second + stats.third }}</b-list-group-item>
        <b-list-group-item>Number of unknown results: {{ stats.unknown }}</b-list-group-item>
      </b-list-group>
    </b-card>
  </div>
</template>

<script>
    export default {
      name: "Paddler",
      data () {
        return {
          errors: [],
          paddlers: [],
          search: '',
          stats: [],
          paddlerClicked: false,
          dropdown: true,
          currentPaddler : []
        }
      },
      watch: {
        // if search is started
        search: function() {
          let _this = this;
          // if search length is greater than 3
          if(_this.search.length >= 3){
            _this.dropdown = true;
            // search for term in database
            _this.$http
              .get('search?term=' + _this.search)
              .then(response => {
                _this.paddlers = response.data.response;
                // get search results and if not results send message
                if(_this.paddlers.length === 0){
                  _this.$swal("No search results", "", "error");
                } else if (_this.paddlers.length === 1){
                  _this.handlePaddler(_this.paddlers[0]);
                }
              })
              .catch(error => {
                _this.$swal("Search error", error.response.data, "error");
              })
          } else if (_this.search.length == 0){
            _this.dropdown = false;
          }
        }
      },
      methods : {
        // if paddler is selected
        handlePaddler(paddler) {
          let _this= this;
          console.log(paddler)
          _this.currentPaddler = paddler;
          // get padder stats
          _this.$http
            .get('/paddlerstats?id=' + paddler.paddlerID)
            .then(response => {
              // set fields and bind so they display on html
              _this.paddlerClicked = true;
              _this.dropdown = false;
              _this.stats = response.data.response[0];
              _this.stats["name"] = paddler.name;
            })
            .catch(error => {
              console.log(error);
            })
        }
      }
    }
</script>

<style scoped>
  .paddlerList {
    height: 200px;
    overflow: hidden;
    overflow-y: auto
  }

  .paddler {
    cursor: pointer;
  }

  .title {
    text-align: left;
    font-size: 28px;
    font-weight: 600;
  }

  .card-body {
    padding: 0px;
  }

</style>
