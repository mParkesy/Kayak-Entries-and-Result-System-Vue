<template>
  <div id="runrace" class=" py-4">
    <b-container class="text-center mx-auto">
      <b-row class="col-lg-12 mx-auto mt-4">
          <h2>Running race: {{ race.raceName }}</h2>
      </b-row>
    </b-container>
  </div>
</template>

<script>
    export default {
      name: "RunRace",
      data () {
        return {
          race : [],

        }
      },
      created(){
        let _this = this;
        _this.$http
          .get('/race?id=' + this.$route.params.id)
          .then(response => {
            _this.race = response.data.response[0];
            console.log(_this.race);
          })
      },
      methods : {

      }
    }
</script>

<style scoped>

</style>
