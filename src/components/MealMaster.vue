g<template lang="html">
  <div class="section">
    <div class="columns">
      <div class="column">
        <div class="columns">
          <div class="column is-one-third">
            <h1 id="top" class="title is-3">Meals</h1>
          </div>
        </div>
        <div class="columns is-centered">
          <div class="column is-one-third">
            <div class="field">
              <label class="label">Title</label>
              <div class="control">
                <input type="text" class="input" v-bind:class="{'mybox':!isValidTitle}" placeholder="Enter Title" v-model="meal.title" @keyup.enter="addMeal">
                <p class="help" v-bind:class="{'is-info': !isValidTitle}" v-if="!isValidTitle">Please fill a valid Title.</p>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <label class="label">Combo</label>
                <b-select placeholder="Select a Combo" ref="combo" class="select" v-model="meal.combo">
                  <option v-bind:value="combo" v-for="combo in combos" v-bind:key="combo._id">{{combo.title}}</option>
                </b-select>
              </div>
            </div>
            <div class="container" v-if="meal.combo !== null">
              <div class="content" v-for="(cat, idx) in meal.combo.categories" v-bind:key="cat._id">
                <div class="field">
                  <label class="label">{{cat.title}}</label>
                  <b-select v-bind:placeholder="cat.title" class="select" v-model="meal.dishes[idx]">
                    <option v-bind:value="dish" v-for="dish in dishes" v-if="(dish.category && (dish.category._id === cat._id))" v-bind:key="dish._id">{{dish.title}}</option>
                  </b-select>
                </div>
              </div>
            </div>
            <div class="field">
              <h1 class="title is-3">&#8377;{{mealCost}}</h1>
            </div>
            <div class="field">
              <button v-bind:class="{'is-loading': isAdding}" v-bind:disabled="!isFormReady" @click="addMeal" class="button is-primary is-medium is-rounded">{{AddOrEdit}}</button>
              <button class="button is-rounded is-transparent" v-if="(AddOrEdit == 'Update')" @click="resetMeal()">cancel</button>
            </div>
          </div>
        </div>
        <div class="column">
          <div class="box">
            <table class="table mytable is-fullwidth table-striped">
              <tr class="tr">
                <td class="thead">Title</td>
                <td class="thead">Combo</td>
                <td class="thead">Dishes</td>
                <td class="thead">Actions</td>
              </tr>
              <tr class="tr" v-for="m in meals" v-bind:key="m._id">
                <td class="td"><h1 class="title is-4">{{m.title}}</h1></td>
                <td class="td"><h1 class="title is-4" v-if="m.combo">{{m.combo.title}}</h1></td>
                <td class="td">
                  <div class="tags">
                    <span class="tag is-rounded is-info" v-for="dish in m.dishes" v-bind:key="dish._id">{{dish.title}}</span>
                  </div>
                </td>
                <td class="td">
                  <button v-bind:disabled="(meal && (m._id === meal._id))" class="button is-small is-link is-rounded" @click="editMeal(m)">Edit</button>
                  <button @click="deleteMeal(m)" class="button is-small is-danger is-rounded">X</button>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'DishMaster',
  created () {
    this.refresh()
  },
  data () {
    return {
      isAdding: false,
      test: '',
      cost: '',
      categories: [],
      dishes: [],
      combos: [],
      meals: [],
      category: null,
      meal: {
        title: '',
        combo: null,
        dishes: []
      }
    }
  },
  computed: {
    mealCost: function () {
      if (this.meal.combo !== null) {
        var sum = 0
        this.meal.dishes.forEach(function (dish) {
          sum += dish.cost
        })
        return sum
      } else {
        return 0
      }
    },
    isValidTitle: function () {
      return this.meal.title.match(new RegExp(/^.+$/))
    },
    isValidCombo: function () {
      return !(this.selectedCombo === null)
    },
    isValidDishes: function () {
      this.meal.dishes.forEach(function (dish) { if (dish === null) { return false } })
      return true
    },
    isFormReady: function () {
      return (this.isValidTitle && this.isValidDishes && this.isValidCombo)
    },
    AddOrEdit: function () {
      return (this.meal._id ? 'Update' : 'Add')
    }
  },
  methods: {
    resetMeal: function () {
      this.meal = {
        title: '',
        combo: null
      }
    },
    refresh: function () {
      this.dishes = []
      this.categories = []
      this.combos = []
      this.meals = []
      var vm = this
      this.infoMsg('Fetching data...')
      axios.get('/categories')
        .then(
          (resp) => {
            resp.data.forEach(function (cat) {
              vm.categories.push(cat)
            })
          },
          (err) => {
            console.log('error in fetching categories', err)
          })
      axios.get('/dishes')
        .then(
          (resp) => {
            resp.data.forEach(function (dish) {
              vm.dishes.push(dish)
            })
          },
          (err) => {
            console.log('error in fetching dishes', err)
          })
      axios.get('/combos')
        .then(
          (resp) => {
            resp.data.forEach(function (combo) {
              vm.combos.push(combo)
            })
          },
          (err) => {
            console.log('error in fetching combos', err)
          })
      axios.get('/meals')
        .then(
          (resp) => {
            console.log('Meals out', resp)
            resp.data.forEach(function (meal) {
              vm.meals.push(meal)
            })
          },
          (err) => {
            console.log('error in fetching meals', err)
          })
    },
    addMeal: function () {
      var vm = this
      this.isAdding = true

      if (this.meal._id) { // update an existing object
        axios.put('/meals/' + this.meal._id, this.meal)
          .then(
            (resp) => {
              vm.resetMeal()
              vm.successMsg('Updated')
              vm.refresh()
            },
            (err) => {
              console.log('Error', err)
              vm.successMsg('Error in updating')
            })
      } else { // post a new object
        axios.post('/meals', this.meal)
          .then(
            (resp) => {
              vm.resetMeal()
              vm.successMsg('Updated')
              vm.refresh()
            },
            (err) => {
              console.log('error in posting to /dishes', err)
              vm.notify = 'Error creating dish.'
              vm.isError = true
              vm.isAdding = false
            })
      }
    },
    successMsg: function (msg) {
      this.isAdding = false
      this.$toast.open({
        duration: 5000,
        message: msg,
        queue: true,
        type: 'is-success',
        position: 'is-bottom'
      })
    },
    infoMsg: function (msg) {
      this.isAdding = false
      this.$toast.open({
        duration: 2000,
        message: msg,
        queue: false,
        type: 'is-success',
        position: 'is-top'
      })
    },
    deleteMeal: function (meal) {
      this.isAdding = true
      var vm = this
      axios.delete('/meals/' + meal._id).then(
        (resp) => {
          this.isAdding = false
          vm.refresh()
        },
        (err) => {
          console.log('Error in deleting', err)
          vm.isAdding = false
        })
    },
    editMeal: function (meal) {
      this.meal = meal
      console.log('Meal', meal)
    }
  }
}
</script>

<style>
  .mybox {
  border: 2px solid red
  }
</style>
