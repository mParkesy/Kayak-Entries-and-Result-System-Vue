<!--
  This page is the homepage which contains the background video and some intro elements
-->

<template>
  <header>
    <b-modal
      id="about"
      size="m"
      centered
      title="Herbert Blondie Race Management"
      ref="about"
      hide-footer
    >
      <p>
        HBRM is an entry and results system for kayak and canoe marathon racing. It is a web application that maintains
        its records with the use of a database of race results and paddler information.
        A team leader or race organiser can sign up and carry out the tasks that they would normally do, however
        everything is in a more centralised space and requires no importing of ranking lists or emailing.
      </p>
    </b-modal>
    <video autoplay muted loop id="myVideo">
      <source src="../assets/video.mp4" type="video/mp4">
    </video>
    <div class="overlay"></div>
    <!-- Optional: some overlay text to describe the video -->
    <div class="content">
      <div class="container my-auto">
        <div class="row">
          <div class="col-lg-10 mx-auto">
            <h1 class="text-uppercase">
              <strong>Herbert Blondie Race Managment</strong>
            </h1>
            <hr>
          </div>
          <div class="col-lg-8 mx-auto">
            <p class="text-faded mb-5">Welcome to the Herbert Blondie Race Management website, a new system aimed at making races easier to enter, run and manage.</p>
            <a class="btn btn-primary btn-xl js-scroll-trigger" v-b-modal.about>Find Out More</a>
          </div>
        </div>
      </div>
    </div>
       <!-- <div class="masthead text-center text-white d-flex">
          <div class="container my-auto">
            <div class="row">
              <div class="col-lg-10 mx-auto">
                <h1 class="text-uppercase">
                  <strong>Herbert Blondie Race Managment</strong>
                </h1>
                <hr>
              </div>
              <div class="col-lg-8 mx-auto">
                <p class="text-faded mb-5">Welcome to the Herbert Blondie Race Management website, a new system aimed at making races easier to enter, run and manage.</p>
                <a class="btn btn-primary btn-xl js-scroll-trigger" href="/about">Find Out More</a>
              </div>
            </div>
          </div>
        </div>-->
  </header>
</template>

<script>
    export default {
        name: "Home",
        data () {
          return {

          }
      },
      created() {
        let _this = this;
        // if thee message passed the home page is of a certain type then open error alert
        if(_this.$route.query.message === "d41d8cd98f00b204e9800998ecf8427e"){
          _this.$swal("Error", "Please login to get that information.", "error")
        } else if (_this.$route.query.message === "84b42204e14f78f4216ac0d9f7fa1db0"){
          _this.$swal("Error", "The results system is currently down, please try again soon.", "error")
        }
      }
    }
</script>

<style scoped>
  #myVideo {
    position: fixed;
    right: 0;
    top: 0px;
    min-width: 100%;
    min-height: 100%;
    z-index: -1;
    transform: translateX(calc((100% - 100vw) / 2));
    -webkit-filter: blur(1px);
    -moz-filter: blur(1px);
    -o-filter: blur(1px);
    -ms-filter: blur(1px);
    filter: blur(1px);
  }

  .content {
    position: fixed;
    top: 24%;
    color: #f1f1f1;
    width: 100%;
    padding: 20px;
  }

  .overlay {
    position: fixed;
    right: 0;
    top: 0px;
    min-width: 100%;
    min-height: 100%;
    z-index: -1;
    background: rgba(0, 0, 0, 0.3);
  }
</style>
