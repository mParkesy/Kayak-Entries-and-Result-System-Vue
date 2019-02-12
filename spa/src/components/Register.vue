<template>
  <header>
    <div class="masthead text-center text-white d-flex ">
      <div class="container my-auto">
        <div class="row">
          <div class="col-lg-4 mx-auto text-center">
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
                <input type="text" v-model="confirm_password" id="confirmPassword" class="form-control" placeholder="Confirm Password" required>
              </div>
              <div class="form-group">
                <input type="text" v-model="name" id="name" class="form-control" placeholder="Full name" required>
              </div>
              <div class="form-group">
                <input type="text" v-model="regPassword" id="regPassword" class="form-control" placeholder="Club Password" required>
              </div>

              <div class="form-group">
                <select id="account" v-model="is_raceorganiser" required class="form-control">
                  <option value="0">Team Leader</option>
                  <option value="1">Race Organiser</option>
                </select>
              </div>
                <button class="btn btn-lg btn-primary btn-block" type="submit" @click="handleSubmit">Submit</button>
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
          handleSubmit(e){
          let _this= this;
          e.preventDefault()
          if (this.password === this.confirm_password && this.password.length > 0){
            this.$http.post('http://localhost:8888/register', {
              email: this.email,
              password: this.password,
              name: this.name,
              regPassword: this.regPassword,
              is_raceorganiser: this.is_raceorganiser
            })
              .then(response => {
                _this.$swal("Registration Successful", response.data, "success")
                  .then(() => {
                    this.$router.push('/login')
                  })

              })
              .catch(error => {
                _this.$swal("Registration Failed", error.response.data, "error");
                _this.email = "";
                _this.password="";
                _this.name="";
                _this.regPassword="";
              });
          } else {
            this.password = "";
            this.confirm_password = "";
            alert("passwords were not the same");
          }
        }
      }
    }
</script>

<style scoped>

</style>
