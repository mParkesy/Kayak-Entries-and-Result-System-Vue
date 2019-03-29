<template>
  <header>

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
            <a class="btn btn-primary btn-xl js-scroll-trigger" href="/about">Find Out More</a>
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
        name: "Home"
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

  /* Add some content at the bottom of the video/page */
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
