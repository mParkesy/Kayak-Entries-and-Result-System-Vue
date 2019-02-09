<template>
    <div id="races">
      <table class="table table-bordered">
        <thead>
        <tr>
          <th scope="col">Race Name</th>
          <th scope="col">Year</th>
          <th scope="col">test</th>
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
          <th></th>
        </tr>
        </tbody>
      </table>
    </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'Races',
    data () {
      return {
        info: [],
        errors: []
      }
    },
    created() {
      axios
        .get('http://localhost:8888/races')
        .then(response => {
          this.info = response.data.response;
          console.log(this.info);
          // JSON responses are automatically parsed.
          /*          let b = [];
                    for (var a in this.info){
                      let item = this.info[a];
                      b.push({
                        "name" : item.raceName,
                        "year" : item.year
                      });
                      console.log();
                    }
                    console.log(b);*/
        })
        .catch(e => {
          this.errors.push(e)
        })
    }
  }


</script>

<style scoped>

</style>
