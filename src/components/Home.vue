<template lang="html">
  <div>
    <section class="hero">
      <div class="hero-body">
        <div class="container">
          <div class="columns">
            <div class="column">
              <div class="pattisollu">
                <h1 class="title is-2">Menu</h1>
                <p class="subtitle is-3" v-if="pendingLoads === 0">We have <strong>{{categories.length}}</strong> categories of dishes, <strong>{{dishes.length}}</strong> different dishes and <strong>{{combos.length}}</strong> combo packages.</p>
                <p class="subtitle is-3" v-else>We have a huge variety of dishes to appeal to you. <a class="button" @click="refresh">View</a></p>
                <p class="subtitle is-3">Come, explore our rich menu!</p>
              </div>
            </div>
            <div class="column is-one-fifth">
              <figure class="image is-square">
                <img src="../assets/chef.png">
              </figure>
            </div>
          </div>
          <div class="columns">
            <div class="column is-fullwidth">
              <section class="is-fullwidth">
                <b-tabs v-model="activeTab" type="is-toggle-rounded" size="is-large" :expanded=true :animated=true>
                  <b-tab-item label="Categories">
                    <section class="section">
                      <div class="tags is-centered">
                        <span class="tag is-large is-danger is-rounded" v-for="cat in categories" v-bind:key="cat._id">{{cat.title}}</span>
                      </div>
                    </section>
                  </b-tab-item>
                  <b-tab-item label="Dishes">
                    <div class="container">
                      <carousel :per-page=1 :perPageCustom="[[480,2],[768,3],[1024,4]]" :navigation-enabled=true :autoplay=true :autoplay-hover-pause=true :autoplay-timeout=5000>
                        <slide v-for="dish in dishes" v-bind:key="dish._id">
                          <div class="box dishbox">
                            <h1 class="title is-4">{{dish.title}}</h1>
                            <h2 class="title is-5">₹{{dish.cost}}</h2>
                            <p class="subtitle is-5">{{dish.category.title}}</p>
                          </div>
                        </slide>
                      </carousel>
                    </div>
                  </b-tab-item>
                  <b-tab-item label="Combo">
                    <div class="container">
                      <carousel :per-page=1 :perPageCustom="[[480,2],[768,3],[1024,4]]" :autoplay=true :autoplay-hover-pause=true :autoplay-timeout=5000>
                        <slide v-for="combo in combos" v-bind:key="combo._id">
                          <div class="box dishbox">
                            <h1 class="title is-4">{{combo.title}}</h1>
                            <div class="tags">
                              <span class="tag is-rounded is-primary is-medium" v-for="cat in combo.categories" v-bind:key="cat._id">
                                {{cat.title}}
                              </span>
                            </div>
                          </div>
                        </slide>
                      </carousel>
                    </div>
                  </b-tab-item>
                </b-tabs>
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="hero is-small herodelivery">
      <div class="hero-body">
        <div class="container">
          <div class="columns">
            <div class="column">
              <img src="../assets/bikedelivery.png">
            </div>
            <div class="column">
              <h1 class="title">At your Doorsteps</h1>
              <h2 class="subtitle">We offer regular delivery of Lunch and Dinner of many traditional south indian dishes.</h2>
              <div class="content">
                <div class="columns">
                  <div class="column phonenums">
                    <h1 class="subtitle">Call us now</h1>
                    <ul>
                      <li><a class="button is-primary is-rounded is-medium" href="tel://9500095627">9500095627</a></li>
                      <li><a class="button is-primary is-rounded is-medium" href="tel://9500095127">9500095127</a></li>
                    </ul>
                  </div>
                  <div class="column">
                    <h2 class="subtitle">Or, drop a message!</h2>
                    <router-link class="button is-primary is-large is-rounded" to="/contact">Contact</router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Home',
  data () {
    return {
      pendingLoads: 4,
      meals: [],
      categories: [],
      combos: [],
      dishes: [],
      activeMeal: null,
      activeCombo: null,
      activeTab: 1
    }
  },
  created () {
    this.refresh()
  },
  methods: {
    reset: function () {
      this.pendingLoads = 4
      this.meals = []
      this.categories = []
      this.combos = []
      this.dishes = []
      this.activeMeal = null
    },
    refresh: function () {
      var vm = this
      this.reset()
      axios.get('/meals')
        .then(
          (resp) => {
            resp.data.forEach(function (m) {
              vm.meals.push(m)
            })
            this.pendingLoads -= 1
          },
          (err) => {
            console.log('Error in fetching Meals', err)
          })

      axios.get('/categories')
        .then(
          (resp) => {
            resp.data.forEach(function (c) {
              vm.categories.push(c)
            })
            vm.pendingLoads -= 1
          },
          (err) => {
            console.log('Error in fetching Meals', err)
          })

      axios.get('/dishes')
        .then(
          (resp) => {
            resp.data.forEach(function (d) {
              vm.dishes.push(d)
            })
            vm.pendingLoads -= 1
          },
          (err) => {
            console.log('Error in fetching Meals', err)
          })

      axios.get('/combos')
        .then(
          (resp) => {
            resp.data.forEach(function (c) {
              vm.combos.push(c)
            })
            vm.pendingLoads -= 1
          },
          (err) => {
            console.log('Error in fetching Meals', err)
          })
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Satisfy');
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

.pattisollu {
  font-family: 'Satisfy', cursive;
  font-size: 24px;
}
.mycard {
  background-color: #caba99
}
.dishbox {
  margin: 15px;
}
.strong {
  color: #aa0011;
}
.phonenums ul {
  list-style-type: none;
}
</style>
