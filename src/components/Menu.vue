<template lang="html">
  <div class="mycontainer">
    <section class="hero">
      <div class="hero-body">
        <div class="container">
          <div class="columns">
            <div class="column">
              <div class="pattisollu">
                <h1 class="title is-2">Menu</h1>
                <p class="subtitle is-3">We have <strong>{{categories.length}}</strong> categories of dishes, <strong>{{dishes.length}}</strong> different dishes and <strong>{{combos.length}}</strong> combo packages.</p>
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
                <b-tabs v-model="activeTab" type="is-toggle-rounded" size="is-medium" :expanded=true :animated=true>
                  <b-tab-item label="Categories">
                    <section class="section">
                      <div class="tags is-centered">
                        <span class="tag is-medium is-danger is-rounded" v-for="cat in categories" v-bind:key="cat._id">{{cat.title}}</span>
                      </div>
                    </section>
                  </b-tab-item>
                  <b-tab-item label="Dishes">
                    <div class="container">
                      <carousel :per-page=1 :perPageCustom="[[480,2],[768,3],[1024,4]]" :navigation-enabled=true :autoplay=true :autoplay-hover-pause=true :autoplay-timeout=5000>
                        <slide v-for="dish in dishes" v-bind:key="dish._id">
                          <div class="box dishbox">
                            <h1 class="title is-5">{{dish.title}}</h1>
                            <h2 class="title is-6">₹{{dish.cost}}</h2>
                            <p class="subtitle is-6" v-if="dish.category">{{dish.category.title}}</p>
                          </div>
                        </slide>
                      </carousel>
                    </div>
                  </b-tab-item>
                  <b-tab-item label="Combo">
                    <div class="container">
                      <carousel :per-page=1 :perPageCustom="[[480,2],[768,3],[1024,4]]" navigation-enabled="true" autoplay="true" autoplay-hover-pause="true" autoplay-timeout="5000">
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
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Home',
  data () {
    return {
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
      this.meals = []
      this.categories = []
      this.combos = []
      this.dishes = []
      this.activeMeal = null
    },
    prevMeal: function () {
      if (this.meals.length >= 1) {
        if (this.activeMeal) {
          // something is already selected, find out its position in list
          var idx = this.meals.indexOf(this.activeMeal)
          if ((idx - 1) < 0) {
            idx = this.meals.length - 1
          } else {
            idx = idx - 1
          }
          this.activeMeal = this.meals[idx]
        } else {
          this.activeMeal = this.meals[this.meals.length - 1]
        }
      } else {
        console.log('meals is empty! why?!')
      }
    },
    nextMeal: function () {
      if (this.meals.length >= 1) {
        if (this.activeMeal) {
          // something is already selected, find out its position in list
          var idx = this.meals.indexOf(this.activeMeal)
          if ((idx + 1) < (this.meals.length - 1)) {
            idx = this.meals.length - 1
          } else {
            idx = idx + 1
          }
          this.activeMeal = this.meals[idx]
        } else {
          this.activeMeal = this.meals[this.meals.length - 1]
        }
      } else {
        console.log('meals is empty! why?!')
      }
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
          },
          (err) => {
            console.log('Error in fetching Meals', err)
          })
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Satisfy');

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
</style>
