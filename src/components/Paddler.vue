<template>
  <div id="paddler" class="col-lg-8 mx-auto pt-4">
    <b-form-input v-model="search"
                  type="search"
                  placeholder="Search for a paddler"></b-form-input>

    <b-list-group class="paddlerList" v-if="dropdown">
      <b-list-group-item  class="paddler" v-for="paddler in paddlers" :key="paddler.paddlerID" @click="handlePaddler(paddler)">{{ paddler.name }}</b-list-group-item>
    </b-list-group>

    <b-card  v-if="paddlerClicked" class="mt-4">
      <h4 class="m-0" slot="header">{{ stats.name }}</h4>
      <b-list-group class="p-0" flush>
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
        }
      },
      watch: {
        search: function() {
          let _this = this;
          if(this.search.length >= 3){
            this.dropdown = true;
            this.$http
              .get('search?term=' + this.search)
              .then(response => {
                this.paddlers = response.data.response;
                if(this.paddlers.length === 0){
                  _this.$swal("No search results", "", "error");
                } else if (this.paddlers.length === 1){
                  this.handlePaddler(this.paddlers[0]);
                }
              })
              .catch(error => {
                _this.$swal("Search error", error.response.data, "error");
              })
          }
        }
      },
      methods : {
        handlePaddler(paddler) {
          let _this= this;
          this.$http
            .get('/paddlerstats?id=' + paddler.paddlerID)
            .then(response => {
              this.paddlerClicked = true;
              this.dropdown = false;
              this.stats = response.data.response[0];
              this.stats["name"] = paddler.name;
              console.log(this.stats);
            })
            .catch(error => {

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

  .card-body {
    padding: 0px;
  }

</style>
