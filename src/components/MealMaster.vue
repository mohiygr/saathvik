g<template lang="html">
  <div class="section">
    <div class="modal" v-bind:class="{'is-active':isAdding}">
      <div class="modal-background"></div>
      <div class="modal-content box">
        <div class="notification has-text-centered">
          <p class="subtitle">Loading... </p>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <div class="columns">
          <div class="column is-one-third">
            <h1 id="top" class="title is-3">Meals</h1>
            <div v-if="isError" class="notification is-danger">
              <button @click="isError = false" class="delete"></button>
              {{notify}}
            </div>
            <div v-if="isSuccess" class="notification is-success">
              <button @click="isSuccess = false" class="delete"></button>
              {{notify}}
            </div>
          </div>
        </div>
        <div class="columns is-centered">
          <div class="column is-one-third">
            <div class="field">
              <label class="label">Title</label>
              <div class="control">
                <input type="text" class="input" v-bind:class="{'mybox':!isValidTitle}" placeholder="Enter Title" v-model="title" @keyup.enter="addMeal">
                <p class="help" v-bind:class="{'is-info': !isValidTitle}" v-if="!isValidTitle">Please fill a valid Title.</p>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <b-select placeholder="Select a Combo" ref="combo" class="select" v-model="selectedCombo">
                  <option v-bind:value="combo" v-for="combo in combos" v-bind:key="combo._id">{{combo.title}}</option>
                </b-select>
              </div>
            </div>
            <div class="level" v-if="selectedCombo !== null">
              <div class="level-item" v-for="(cat, idx) in selectedCombo.categories" v-bind:key="cat._id">
                <div class="field">
                  <label class="label">{{cat.title}}</label>
                  <b-select v-bind:placeholder="cat.title" class="select" v-model="selectedDishes[idx]">
                    <option v-bind:value="dish" v-for="dish in dishes" v-if="(dish.category._id === cat._id)" v-bind:key="dish._id">{{dish.title}}</option>
                  </b-select>
                </div>
              </div>
            </div>
            <div class="field">
              <h1 class="title is-3">₹{{mealCost}}</h1>
            </div>
            <div class="field">
              <button v-bind:class="{'is-loading': isAdding}" v-bind:disabled="!isFormReady" @click="addMeal" class="button is-primary is-medium is-rounded">{{AddOrEdit}}</button>
              <button class="button is-rounded is-transparent" v-if="(AddOrEdit == 'Update')" @click="meal = null; selectedDishes = []; selectedCombo = null; title = ''">cancel</button>
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
                <td class="td"><h1 class="title is-4">{{m.combo.title}}</h1></td>
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
      test: '',
      isError: false,
      isSuccess: false,
      isAdding: false,
      cost: '',
      categories: [],
      dishes: [],
      combos: [],
      meals: [],
      selectedCombo: null,
      selectedDishes: [],
      category: null,
      meal: null, // means, "new", else means "Edit" to given id
      title: '',
      titleBeforeUpdate: ''
    }
  },
  computed: {
    mealCost: function () {
      if (this.selectedCombo !== null) {
        var sum = 0
        this.selectedDishes.forEach(function (dish) {
          sum += dish.cost
        })
        return sum
      } else {
        return 0
      }
    },
    isValidTitle: function () {
      return this.title.match(new RegExp(/^.+$/))
    },
    isValidCombo: function () {
      return !(this.selectedCombo === null)
    },
    isValidDishes: function () {
      this.selectedDishes.forEach(function (dish) { if (dish === null) { return false } })
      return true
    },
    isFormReady: function () {
      return (this.isValidTitle && this.isValidDishes && this.isValidCombo)
    },
    AddOrEdit: function () {
      return (this.meal ? 'Update' : 'Add')
    }
  },
  methods: {
    refresh: function () {
      this.dishes = []
      this.categories = []
      this.combos = []
      this.meals = []
      var vm = this
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
      var newMeal = { title: this.title, combo: this.selectedCombo, dishes: this.selectedDishes }

      if (this.meal) { // update an existing object
        axios.put('/meals/' + this.meal._id, newMeal)
          .then(
            (resp) => {
              vm.meal = null
              vm.selectedCombo = null
              vm.selectedDishes = []
              vm.isError = false
              vm.title = ''
              vm.isSuccess = true
              vm.isAdding = false
              vm.notify = 'Updated!'
              vm.refresh()
            },
            (err) => {
              console.log('Error', err)
              vm.notify = 'could not update. Please try again'
              vm.isError = true
              vm.catId = null
              vm.title = ''
              vm.selectedCombo = null
              vm.selectedDishes = []
              vm.isAdding = false
            })
      } else { // post a new object
        axios.post('/meals', newMeal)
          .then(
            (resp) => {
              vm.isAdding = false
              vm.isError = false
              vm.isSuccess = true
              vm.notify = 'Added!'
              vm.title = ''
              vm.selectedCombo = null
              vm.selectedDishes = []
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
    deleteMeal: function (meal) {
      this.isAdding = true
      var vm = this
      var title = meal.title
      axios.delete('/meals/' + meal._id).then(
        (resp) => {
          vm.isAdding = false
          vm.isSuccess = true
          vm.notify = 'Successfully deleted "' + title + '"'
          vm.refresh()
        },
        (err) => {
          console.log('Error in deleting', err)
          vm.isAdding = false
          vm.isError = true
          vm.notify = 'could not delete "' + title + '"'
        })
    },
    editMeal: function (meal) {
      this.meal = meal
      this.selectedCombo = meal.combo
      // this.selectedDishes = meal.dishes
      // find in categories, catId and set title to that
      this.title = meal.title
    }
  }
}
</script>

<style>
  .mybox {
  border: 2px solid red
  }
</style>
