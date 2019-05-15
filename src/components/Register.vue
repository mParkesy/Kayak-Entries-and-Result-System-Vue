<!--
  This is the registration component for a team leader or race organiser to sign up to the site.
-->

<template>
  <header>
    <div class="masthead text-center text-white d-flex ">
      <div class="container my-auto">
        <div class="row">
          <div class="col-md-8 mx-auto text-center">
            <h1 class="text-uppercase">
              <strong>Register</strong>
            </h1>
            <hr>
            <form>
              <div class="form-group">
                <input type="email" v-model="email" id="email" class="form-control" placeholder="Email address" required autofocus>
              </div>
              <div class="form-group">
                <input type="password" v-model="password" id="password" class="form-control" placeholder="Password" required>
              </div>
              <div class="form-group">
                <input type="password" v-model="confirm_password" id="confirmPassword" class="form-control" placeholder="Confirm Password" required>
              </div>
              <div class="form-group">
                <input type="text" v-model="name" id="name" class="form-control" placeholder="Full name" required>
              </div>
              <div class="form-group">
                <input type="text" v-model="regPassword" id="regPassword" class="form-control" placeholder="Club Password" required>
              </div>
              <div class="form-group">
              <b-form-select v-model="is_raceorganiser" id="account">
                <template slot="first">
                  <option :value="null" disabled>Select Account Type</option>
                </template>
                <option value="0">Team Leader</option>
                <option value="1">Race Organiser</option>
                <option value="2">Both</option>
              </b-form-select>
              </div>
                <b-button size="lg" variant="primary" block type="submit" @click="handleSubmit">Register</b-button>
            </form>
          </div>
        </div>
      </div>
    </div>

  </header>
</template>

<script>
    export default {
      name: "Register",
      props : ["nextUrl"],
      data() {
        return {
          email: "",
          password: "",
          confirm_password: "",
          name: "",
          regPassword: "",
          is_raceorganiser: null
        }
      },
      methods : {
          // if form submitted
          handleSubmit(e){
          let _this= this;
          e.preventDefault()
            // check passwords are the same and off good length
          if (_this.password === _this.confirm_password && _this.password.length > 0){
            // register the user to the database
            _this.$http.post('/register', {
              email: _this.email,
              password: _this.password,
              name: _this.name,
              regPassword: _this.regPassword,
              is_raceorganiser: _this.is_raceorganiser
            })
              .then(response => {
                // successful registration
                _this.$swal("Registration Successful", response.data, "success")
                  .then(() => {
                    _this.$router.push('/login')
                  })

              })
              // registration error, reset fields
              .catch(error => {
                _this.$swal("Registration Failed", error.response.data, "error");
                _this.email = "";
                _this.password = "";
                _this.name = "";
                _this.regPassword = "";
                _this.confirm_password = "";
                console.log(error);
              });
          } else {
            // error, passwords were not the same
            _this.password = "";
            _this.confirm_password = "";
            _this.$swal("Registration Failed", "Passwords were not the same", "error");
          }
        }
      }
    }
</script>

<style scoped>

</style>
