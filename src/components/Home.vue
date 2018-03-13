<template lang="html">
  <div>
    <section class="hero is-small herodelivery">
      <div class="hero-body">
        <div class="container">
          <div class="columns">
            <div class="column">
              <img src="../assets/bikedelivery.png">
            </div>
            <div class="column">
              <h1 class="title">Organic Lunch & Dinner</h1>
              <h2 class="subtitle">We offer Lunch and Dinner combo of many traditional south indian dishes.</h2>
              <h2 class="subtitle">Delivered at your door step.</h2>
              <router-link class="button is-primary is-large is-rounded" to="/contact">Contact</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="hero is-small herotraditional">
      <div class="hero-body">
        <div class="container">
          <div class="columns">
            <div class="column">
              <h1 class="title">Traditional Cuisines</h1>
              <h2 class="subtitle">From Varutharacha Kozhambu to Akkaravadisal, name it and we do it.</h2>
              <h2 class="subtitle">We employ some rare recipes to tickle your good old memories through your taste buds</h2>
              <router-link class="button brownbg is-large is-rounded" to="/menu">Menu</router-link>
            </div>
            <div class="column">
              <img class="" src="../assets/hero-bananameal.png">
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
    }
  }
}
</script>

<style scoped>
  .herodelivery {
  padding-top: 50px;
  background-color: rgb(220, 180, 130);
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
}
.herotraditional {
  background-color: rgba(180, 220, 130, 255);
  background-image: url('../assets/traditional-bg.jpeg');
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
  }
  .herotraditional h1 {
  color: #dba
  }
  .herotraditional h2 {
  color: #b98
  }
  .brownbg {
  background-color: rgba(190,70, 20);
  color: white;
  }
</style>
