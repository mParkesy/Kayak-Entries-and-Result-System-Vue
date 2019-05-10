<template>
  <div id="runrace" class=" py-4">
    <b-container v-if="canView" class="text-center mx-auto">
      <b-row class="col-lg-12 mt-4">
        <b-col class="py-1" md="8">
          <h2 class="mb-0" style="text-align: left">Running race: {{ race.raceName }}</h2>
        </b-col>
      </b-row>
      <b-row class="col-lg-12 mx-auto mt-4">
        <b-col class="panel py-2" md="12" style="background-color: white;">
          <b-button class="m-1" v-on:click="" type="submit" variant="primary">About</b-button>
          <b-button class="m-1" v-b-modal.textSubmission type="submit" variant="primary">Text Box Time Submission</b-button>
          <b-button class="m-1" v-b-modal.invitephone v-on:click="" type="submit" variant="primary">Invite Finish Phone User</b-button>
          <b-button class="m-1" v-on:click="processResults" type="submit" variant="primary">Process Results</b-button>
          <router-link :to="{ name: 'adminresult', params: { id: race.raceID }}">
            <b-button class="m-1" type="submit" variant="primary">See Results</b-button>
          </router-link>
          <b-button class="m-1" v-on:click="submitAdvisor" type="submit" variant="primary">Submit Results</b-button>
        </b-col>
      </b-row>

      <b-modal
        @ok="finishPhone"
        id="invitephone"
        size="m"
        centered
        title="Invite phone user for time input"
        ref="textModal"
      >
        <p>
          Type the email address of the person that you would like to have access to <br>
          inputting boat number and times to help speed up processing results.<br>
          They will need to click the link in the email to get access.
        </p>
        <b-form-input type="email" v-model="inviteEmail" placeholder="Email Address"></b-form-input>
        <b-alert class="mt-3 mb-0" :show="message.show" :variant="message.type">{{ message.text }}</b-alert>
      </b-modal>
      <b-modal
        @ok="handleModal"
        id="textSubmission"
        size="m"
        centered
        title="Enter Paddler Times In a big text box"
        ref="textModal"
      >
        <p>
          Paddler boat numbers and times should be entered in one long list.<br>
          This is an alternative to
          entering them one by one on each page.<br>
          The format of this entry should be:<br>
          {boatnumber}, {time in hh:mm:ss},<br>
          {boatnumber}, {time in hh:mm:ss},
        </p>
        <b-form-textarea
          placeholder="{boatnumber}, {time in hh:mm:ss},"
          rows="5"
          max-rows="100"
          v-model="textboxSubmission"
        ></b-form-textarea>
      </b-modal>
      <b-row class="col-lg-12 mx-auto mt-4">
        <b-col class="panel py-4" md="5" style="background-color: rgb(254, 193, 6);">
          <h3 class="pb-2">Enter stopwatch start times</h3>
          <p v-if="divisions.length == 0">There are no entries in divisions.</p>
          <b-form @submit="handleStopwatch">
            <b-form-group v-for="(div, index) in divisions" :key="div.raceDivision"
              :id="div.raceDivision"
              :label="'Division ' + div.raceDivision"
            >
              <b-form-input v-model="form.divs[index]" type="time" step="1"/>
            </b-form-group>
            <b-button type="submit" variant="primary">Submit</b-button>
          </b-form>
        </b-col>
        <b-col class="panel py-4 race" offset-md="1" md="6" style="background-color: rgb(32, 169, 215);">
          <h3 class="pb-2">Add paddler time</h3>
          <b-alert :show="message.show" :variant="message.type">{{ message.text }}</b-alert>
          <b-form-group label="Boat number">
            <b-form-input autofocus v-model="boatnumber" type="number" step="1"/>
          </b-form-group>
          <b-form-group label="Time" v-if="selected == 'Finish'">
            <b-form-input v-model="time" type="time" step="1"/>
          </b-form-group>
          <b-form-group label="">
            <b-form-radio-group v-model="selected" :options="options" name="radioInline" />
          </b-form-group>
          <b-button v-on:click="submitPaddlerTime()" type="submit" variant="primary">Submit</b-button>
        </b-col>
      </b-row>
      <b-row v-for="result in results" :key="result.raceID" class="col-lg-14 mx-auto mt-4">
        <b-col class="panel py-3 race xScroll" md="12" style="background-color: rgb(101, 196, 137);">
          <h2 style="text-align: left; font-size: 28px; font-weight: 600;"> Div {{ result[0].raceDivision }} </h2>
          <table class="table col-lg-12 mx-auto mt-2 results" v-bind:class="result[0].raceDivision.includes('_') ? ' k2Table ' : {} ">
            <thead class="thead-dark">
            <tr>
              <th scope="col">Number</th>
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
            <tr v-for="line in result">
              <td>{{ line.boatname }}</td>
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
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script src="./js/test.js">
</script>

<style scoped>
  #runrace {
    background-color: rgb(228, 229, 231);
  }

  @media only screen and (max-width: 767px) {
    .race {
      margin-top: 24px;
    }
  }

  @media only screen and (max-width: 800px) {
    .xScroll {
      overflow-x: scroll;
    }
  }

  td {
    color: white;
  }

</style>
