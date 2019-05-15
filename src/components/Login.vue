<!--
  The login component of the website. It contains a basic form that can be filled in.
-->

<template>
  <header>
    <div class="masthead text-center text-white d-flex" >
      <div class="container my-auto">
        <div class="row">
          <div class="col-lg-4 mx-auto text-center">
            <h1 class="text-uppercase">
              <strong>Login</strong>
            </h1>
            <hr>
          <form class="form-signin">
            <div class="form-group">
              <input type="email" v-model="email" id="email" class="form-control" placeholder="Email address" required autofocus>
            </div>
            <div class="form-group">
              <input type="password" v-model="password" id="password" class="form-control" placeholder="Password" required>
            </div>
            <div>
              <b-button size="lg" variant="primary" block type="submit" @click="handleSubmit">Sign in</b-button>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
  export default {
    name: 'Login',
    data(){
      return {
        email : "",
        password : ""
      }
    },
    created() {
      // if the verification token is sent to this page then reveal verification success message
      let _this = this;
      if(_this.$route.query.result == "bfeqwhf8327rtgq3fq8o"){
        _this.$swal("Account Verified","" , "success");
      } else {

      }
    },
    methods : {
      // on submission of form
      handleSubmit(e){
        let _this= this;
        e.preventDefault()
        // if valid password length
        if (this.password.length > 0) {
          // call database for login
           this.$http.post('/login', {
            email: this.email,
            password: this.password
            })
            .then(response => {
              let data = response.data;
              let active = data.user.active;
              // if account is active and exists
              if(active == 1){
                let is_organiser = data.user.account;
                let user = data.user;
                delete user["account"];
                // set user and token to local storage
                localStorage.setItem('user',JSON.stringify(response.data.user));
                localStorage.setItem('jwt',response.data.token);

                // if jwt in local storage is set
                if (localStorage.getItem('jwt') != null){
                  // send to login page
                  this.$emit('loggedIn');
                  if(this.$route.params.nextUrl != null){
                    // send to next url
                    this.$router.push(this.$route.params.nextUrl);
                  }
                  else {
                    // if is race organiser send to race organiser page
                    if(is_organiser === 1){
                      window.location = "/raceorganiser";
                      //this.$router.push('raceorganiser');
                    }
                    // otherwise send to team leader page
                    else {
                      window.location = "/teamleader";
                    }
                  }
                }
              } else {
                // send error if login details are wrong
                _this.$swal("Login Failed", "Your account may not be verified", "error");
              }
            })
             .catch(error => {
               console.log(error);
              _this.$swal("Login Failed", "", "error");
              _this.email = "";
              _this.password="";
            });
        }
      }
    }
  }
</script>

<style scoped>

</style>
