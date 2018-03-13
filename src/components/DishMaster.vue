<template lang="html">
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
            <h1 id="#form" class="title is-3">Dishes</h1>
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
          <div class="column is-vcentered">
            <div class="field">
              <div class="control">
                <input type="text" ref="title" id="title" class="input" v-bind:class="{'mybox':!isValidTitle}" placeholder="Title" v-model="title" @keyup.enter="addDish">
                <p class="help" v-bind:class="{'is-info': !isValidTitle}" v-if="!isValidTitle">Please fill a valid Title.</p>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <input type="text" ref="cost" class="input" v-bind:class="{'mybox':!isValidCost}" placeholder="Cost" v-model="cost" @keyup.enter="addDish">
                <p class="help" v-bind:class="{'is-info': !isValidCost}" v-if="!isValidCost">Please fill a valid Cost.</p>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <b-select placeholder="Select a Category" ref="category" class="select" v-model="category">
                  <option v-bind:value="cat" v-for="cat in categories" v-bind:key="cat._id">{{cat.title}}</option>
                </b-select>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="field">
  <button v-bind:class="{'is-loading': isAdding}" v-bind:disabled="!isFormReady" @click="addDish" class="button is-primary is-medium is-rounded">{{AddOrEdit}}</button>
  <button class="button is-rounded is-transparent" v-if="(AddOrEdit == 'Update')" @click="dishId = null; category = null; title = ''; categoryBeforeUpdate = null; cost = ''; titleBeforeUpdate = ''">cancel</button>
            </div>
          </div>
        </div>
        <div class="column">
          <div class="box">
            <table class="table mytable is-fullwidth table-striped">
              <tr class="tr">
                <td class="thead">Title</td>
                <td class="thead">Category</td>
                <td class="thead is-pulled-right">Cost</td>
                <td class="thead">Actions</td>
              </tr>
              <tr class="tr" v-for="dish in dishes" v-bind:key="dish._id">
                <td class="td"><h1 class="title is-4">{{dish.title}}</h1></td>
                <td class="td"><h1 class="title is-4">{{dish.category.title}}</h1></td>
                <td class="td is-pulled-right"><h1 class="title is-4">{{dish.cost}}</h1></td>
                <td class="td"><button v-bind:disabled="(dish._id === dishId)" class="button is-small is-link is-rounded" @click="editDish(dish)">Edit</button> <button @click="deleteDish(dish)" class="button is-small is-danger is-rounded">X</button></td>
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
      isError: false,
      isSuccess: false,
      isAdding: false,
      categories: [],
      dishes: [],
      cost: '',
      category: null,
      dishId: null, // means, "new", else means "Edit" to given id
      selectedCat: null,
      title: '',
      titleBeforeUpdate: ''
    }
  },
  computed: {
    isValidTitle: function () {
      return this.title.match(new RegExp(/^.+$/))
    },
    isValidCost: function () {
      return this.cost.toString().match(new RegExp(/^\d+(\.\d+)*$/))
    },
    isValidCategory: function () {
      return (this.category !== null)
    },
    isFormReady: function () {
      return this.isValidTitle &&
        (this.cost !== this.costBeforeUpdate ||
         this.title !== this.titleBeforeUpdate ||
         this.category !== this.categoryBeforeUpdate) &&
        this.isValidCategory &&
        this.isValidCost
    },
    AddOrEdit: function () {
      return (this.dishId ? 'Update' : 'Add')
    }
  },
  methods: {
    refresh: function () {
      this.dishes = []
      this.categories = []
      var vm = this
      axios.get('/categories')
        .then(
          (resp) => {
            console.log('resp', resp.data)
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
            console.log('resp', resp.data)
            resp.data.forEach(function (dish) {
              vm.dishes.push(dish)
            })
          },
          (err) => {
            console.log('error in fetching categories', err)
          })
    },
    addDish: function () {
      var vm = this
      this.isAdding = true
      var newDish = { title: this.title, category: this.category, cost: this.cost }
      console.log('Dish before update', newDish)

      if (this.dishId) { // update an existing object
        axios.put('/dishes/' + this.dishId, newDish)
          .then(
            (resp) => {
              console.log('update existing dish ' + vm.dishId, resp)
              vm.dishId = null
              vm.category = null
              vm.isAdding = false
              vm.isError = false
              vm.title = ''
              vm.selectedCat = null
              vm.cost = ''
              vm.isSuccess = true
              vm.notify = 'Updated!'
              vm.refresh()
            },
            (err) => {
              console.log('Error updating Dish', err)
              vm.notify = 'could not update. Please try again'
              vm.isError = true
              vm.dishId = null
              vm.category = null
              vm.title = ''
              vm.cost = ''
              vm.selectedCat = null
              vm.cost = null
              vm.isAdding = false
            })
      } else { // post a new object
        axios.post('/dishes', newDish)
          .then(
            (resp) => {
              console.log('created new dish', resp)
              vm.isAdding = false
              vm.isError = false
              vm.isSuccess = true
              vm.notify = 'Added!'
              vm.category = null
              vm.cost = ''
              vm.title = ''
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
    deleteDish: function (dish) {
      this.isAdding = true
      var vm = this
      var title = dish.title
      axios.delete('/dishes/' + dish._id).then(
        (resp) => {
          console.log('Deleted', resp)
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
    editDish: function (dish) {
      this.dishId = dish._id
      this.category = dish.category
      this.selectedCat = dish.category
      // find in categories, catId and set title to that
      this.title = dish.title
      this.cost = dish.cost
      this.titleBeforeUpdate = dish.title
      this.categoryBeforeUpdate = dish.category
      this.costBeforeUpdate = dish.cost

      this.$scrollTo(document.getElementById('#form'), { offset: -100 })
    }
  }
}
</script>

<style>
  .mybox {
  border: 2px solid red
  }
</style>
