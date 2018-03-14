<template lang="html">
  <div class="mycontainer">
    <section class="hero">
      <div class="hero-body">
        <div class="container">
          <div class="columns">
            <div class="column">
              <div class="tabs is-rounded is-toggle">
                <ul>
                  <li v-bind:class="{'is-active':(activeCombo === combo)}" v-for="combo in combos" v-bind:key="combo._id">
                    <a @click="activeCombo = combo">
                      <span>{{combo.title}}</span>
                    </a>
                  </li>
                </ul>
              </div>
              <div v-if="(activeCombo !== null)">
                <div class="card mycard">
                  <header class="card-header pattisollu">
                    <p class="card-header-title">
                      {{activeCombo.title}}
                    </p>
                    <a href="#" class="card-header-icon" aria-label="more options">
                      <span class="icon">
                        <i class="fas fa-angle-down" aria-hidden="true"></i>
                      </span>
                    </a>
                  </header>
                  <div class="card-content" v-if="(activeCombo !== null)">
                    <div class="content">
                      <div class="tags">
                        <span class="tag is-rounded is-primary" v-for="cat in activeCombo.categories" v-bind:key="cat._id">{{cat.title}}</span>
                      </div>
                      <br>
                    </div>
                  </div>
                  <footer class="card-footer">
                    <a href="#" class="card-footer-item">Save</a>
                    <a href="#" class="card-footer-item">Edit</a>
                    <a href="#" class="card-footer-item">Delete</a>
                  </footer>
                </div>
              </div>
              <div class="pattisollu" v-else>
                <h1 class="title is-1 is-pulled-right">Welcome</h1>
              </div>
            </div>
            <div class="column">
              <figure class="image is-square">
                <img src="../assets/chef.png">
              </figure>
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
      currentMeal: null,
      activeCombo: null
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
      this.currentMeal = null
    },
    prevMeal: function () {
      if (this.meals.length >= 1) {
        if (this.currentMeal) {
          // something is already selected, find out its position in list
          var idx = this.meals.indexOf(this.currentMeal)
          if ((idx - 1) < 0) {
            idx = this.meals.length - 1
          } else {
            idx = idx - 1
          }
          this.currentMeal = this.meals[idx]
        } else {
          this.currentMeal = this.meals[this.meals.length - 1]
        }
      } else {
        console.log('meals is empty! why?!')
      }
    },
    nextMeal: function () {
      if (this.meals.length >= 1) {
        if (this.currentMeal) {
          // something is already selected, find out its position in list
          var idx = this.meals.indexOf(this.currentMeal)
          if ((idx + 1) < (this.meals.length - 1)) {
            idx = this.meals.length - 1
          } else {
            idx = idx + 1
          }
          this.currentMeal = this.meals[idx]
        } else {
          this.currentMeal = this.meals[this.meals.length - 1]
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
  @import url('https://fonts.googleapis.com/css?family=Indie+Flower');

  .pattisollu {
  font-family: 'Indie Flower', cursive;
  }
  .mycontainer {
  background-color: #ffa3a3
  }
  .mycard {
  background-color: #aa8383
  }
</style>
