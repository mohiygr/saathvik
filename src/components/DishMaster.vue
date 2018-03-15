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
    <div class="columns is-centered">
      <div class="column is-one-third">
        <div class="columns is-centered">
          <div class="column">
            <h1 id="#form" class="title is-3">Dishes</h1>
          </div>
        </div>
        <div class="columns">
          <div class="column is-centered">
            <div class="box">
              <div class="field">
                <div class="control">
                  <input type="text" ref="title" id="title" class="input" v-bind:class="{'mybox':!isValidTitle}" placeholder="Title" v-model="dish.title" @keyup.enter="addDish">
                  <p class="help" v-bind:class="{'is-info': !isValidTitle}" v-if="!isValidTitle">Please fill a valid Title.</p>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <input type="text" ref="cost" class="input" v-bind:class="{'mybox':!isValidCost}" placeholder="Cost" v-model="dish.cost" @keyup.enter="addDish">
                  <p class="help" v-bind:class="{'is-info': !isValidCost}" v-if="!isValidCost">Please fill a valid Cost.</p>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <b-select placeholder="Select a Category" ref="category" class="select" v-model="dish.category">
                    <option v-bind:value="cat" v-for="cat in categories" v-bind:key="cat._id">{{cat.title}}</option>
                  </b-select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="columns is-centered">
          <div class="column">
            <div class="field">
              <button v-bind:class="{'is-loading': isAdding}" v-bind:disabled="!isFormReady" @click="addDish" class="button is-primary is-medium is-rounded">{{AddOrEdit}}</button>
              <button class="button is-rounded is-transparent" v-if="(AddOrEdit == 'Update')" @click="resetDish">cancel</button>
            </div>
          </div>
        </div>
      </div>
      <div class="columns">
        <div class="column">
          <div class="box">
            <table class="table mytable is-fullwidth table-striped">
              <tr class="tr">
                <td class="thead">Title</td>
                <td class="thead">Category</td>
                <td class="thead is-pulled-right">Cost</td>
                <td class="thead">Actions</td>
              </tr>
              <tr class="tr" v-for="d in dishes" v-bind:key="d._id">
                <td class="td"><h1 class="title is-4">{{d.title}}</h1></td>
                <td class="td"><h1 class="title is-4" v-if="d.category">{{d.category.title}}</h1></td>
                <td class="td is-pulled-right"><h1 class="title is-4">{{d.cost}}</h1></td>
                <td class="td"><button v-bind:disabled="(dish._id === d._id)" class="button is-small is-link is-rounded" @click="editDish(d)">Edit</button> <button @click="deleteDish(d)" class="button is-small is-danger is-rounded">X</button></td>
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
      categories: [],
      dishes: [],
      dish: {
        title: '',
        cost: '0'
      }
    }
  },
  computed: {
    isValidTitle: function () {
      return this.dish.title.match(new RegExp(/^.+$/))
    },
    isValidCost: function () {
      return this.dish.cost.toString().match(new RegExp(/^\d+(\.\d+)*$/))
    },
    isValidCategory: function () {
      return (this.dish.category !== null)
    },
    isFormReady: function () {
      return this.isValidTitle &&
        this.isValidCategory &&
        this.isValidCost
    },
    AddOrEdit: function () {
      return (this.dish._id ? 'Update' : 'Add')
    }
  },
  methods: {
    resetDish: function () {
      this.dish = {
        title: '',
        cost: '0',
        category: null
      }
    },
    successMsg: function (msg) {
      this.$toast.open({
        duration: 5000,
        message: msg,
        queue: true,
        type: 'is-success',
        position: 'is-bottom'
      })
    },
    infoMsg: function (msg) {
      this.$toast.open({
        duration: 1000,
        message: msg,
        queue: false,
        type: 'is-success',
        position: 'is-top'
      })
    },
    refresh: function () {
      this.dishes = []
      this.categories = []
      var vm = this
      vm.infoMsg('Fetching data...')
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
      console.log('Dish before update', this.dish)

      if (this.dish._id) { // update an existing object
        axios.put('/dishes/' + this.dish._id, this.dish)
          .then(
            (resp) => {
              console.log('update existing dish ' + vm.dish._id, resp)
              vm.isAdding = false
              vm.successMsg('Updated')
              vm.resetDish()
              vm.refresh()
            },
            (err) => {
              console.log('Error updating Dish', err)
              vm.successMsg('Failed to update')
              vm.isAdding = false
            })
      } else { // post a new object
        axios.post('/dishes', this.dish)
          .then(
            (resp) => {
              console.log('created new dish', resp)
              vm.isAdding = false
              vm.resetDish()
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
      this.dish = dish
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
